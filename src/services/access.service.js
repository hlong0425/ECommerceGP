import shopModel from '../models/shop.model.js';
import bycrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import { createTokenPair } from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step1: check email;
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registerd',
        };
      }

      const passwordHash = await bycrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // created privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem',
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem',
        //   },
        // });
        
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // Public key CrytoGraphy Standards:
        const storedKey = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey: publicKey,
          privateKey: privateKey
        });

        if (!storedKey) {
          return {
            code: 'xxx',
            message: 'storedKey error',
          };
        }

        // created token pair
        const tokens = await createTokenPair({
          payload: {
            userId: newShop._id,
            email: email,
          },
          publicKey: storedKey,
          privateKey: privateKey,
        });

        console.log(`Created Token Success`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
        roles: [RoleShop.SHOP],
      };
    }
  };
}

export default AccessService;
