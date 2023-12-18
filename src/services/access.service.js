import shopModel from '../models/shop.model.js';
import bycrypt from 'bcrypt';
import crypto, { verify } from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import { createTokenPair } from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';
import { AuthFailureError, BadRequestError, ForbiddenError } from '../core/error.response.js';
import { findByEmail } from './shop.service.js';
import { verifyJWT } from '../auth/authUtils.js';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  

  /* check Token used */
  static handlerRefeshToken = async (refreshToken) => {
    const foundTokenUsed = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if(foundTokenUsed){
      const jwt = await verifyJWT(refreshToken, foundTokenUsed.privateKey);
      console.log({user: jwt.userId, email: jwt.email});

      await KeyTokenService.deleteKeyById(jwt.userId);
      throw new ForbiddenError('Something went wrong, please relogin');
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop not registerd');
    // verifyToken 
    const newJWT = await verifyJWT(refreshToken, holderToken.privateKey);

    const foundShop = await findByEmail({ email: newJWT.email });
    if (!foundShop) throw new AuthFailureError('Shop not registerd');
    
    // create 1 cap:
    const tokens = await createTokenPair({
      payload: {
        userId: newJWT.userId,
        email: newJWT.email,
      },
      publicKey: holderToken.publicKey,
      privateKey: holderToken.privateKey
    });

    //update token:
    await holderToken.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: {refeshTokenUsed: refreshToken }
    });

    return {
        user: {
          userId: newJWT.userId,
          email: newJWT.email,
        },
        tokens        
    }
  }

  static handlerRefeshTokenV2 = async ({ 
    user,
    refreshToken,
    keyStore
  }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)){
      await KeyTokenService.deleteKeyById(userId);
      throw new Error("Something went wrong happend !! Please registerd");
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registerd');

    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registerd")
    } 
    
    const tokens = await createTokenPair({
      payload: { userId, email }, 
      publicKey: keyStore.publicKey, 
      privateKey: keyStore.privateKey
    });

    await KeyTokenService.updateTokens({
      keyId: keyStore._id,
      refreshToken: tokens.refreshToken,
      refreshTokenUsed: refreshToken,
    })

    return { user, tokens }
  }




  static Logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  }

  static login = async ({ email, password, refrestToken = null }) => {
    /*
    1. Check email in dbs.
    2. match password
    3. create AT vs RT and save
    4. generate tokens
    5. get data return login
   */

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Shop not registerd');

    const match = bycrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('Authentication Error');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    const tokens = await createTokenPair({
        payload: { userId: foundShop._id, email },
        publicKey,
        privateKey
      });

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey, privateKey, refreshToken: tokens.refreshToken
    });

    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
      tokens,
    }
  };

  static signUp = async ({ name, email, password }) => {
    try {
      //step1: check email;
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError('Error: Shop already registerd');
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
