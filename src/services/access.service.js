import shopModel from '../models/shop.model.js';
import bycrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import { createTokenPair } from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';
import { BadRequestError } from '../core/error.response.js';

import { findByEmail } from './shop.service.js';
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  /*
    1. Check email in dbs.
    2. match password
    3. create AT vs RT and save
    4. generate tokens
    5. get data return login
  */

  static login = async ({ email, password, refrestToken = null }) => {
    const foundShop = await findByEmail({ email })
    if(!foundShop) throw new BadRequestError('Shop not registerd');

    const match = bycrypt.compare(password, foundShop.password);
    // if(!match) throw new 
  };

  static signUp = async ({ name, email, password }) => {
    try {
      //step1: check email;
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Error: Shop already registerd');
      }


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
          privateKey: privateKey,
        });

        if (!storedKey) {
          throw new BadRequestError('storedKey error');
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
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop,
            }),
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
