import JWT from 'jsonwebtoken';
import asyncHandler from '../helpers/asyncHandler.js';
import { AuthFailureError } from '../core/error.response.js';
import KeyTokenService from '../services/keyToken.service.js';
import { NotFoundError } from '../core/error.response.js';
//service 

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
};

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
  try {
    // access Token:
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};


const authentication = asyncHandler(async(req, res, next) => {
  /* 
    1. Check userId missing
    2. get AccessToken
    3. verifyToken
    4. check user in dbs?
    5. check KeyStore with this userId?
    6. Ok-all => return next() 
  */
    try {
      const userId = req.headers[HEADER.CLIENT_ID];
      if (!userId) throw new AuthFailureError(message = 'Invalid Request');
      
      //2
      const keyStore = await KeyTokenService.findByUserId(userId);
      if (!keyStore) throw new NotFoundError();

      //3
      const accessToken = req.headers[HEADER.AUTHORIZATION]
      if(!accessToken) throw new AuthFailureError("Invalid Request");

      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if(userId !== decodeUser.userId){
        throw new AuthFailureError('Invalid UserId');
      }
      req.keyStore = keyStore;
      return next()
    }
    catch(error) {
      next(error)
    }
});

const verifyJWT = async(token, keySecret) => {
  return await JWT.verify(token, keySecret);
}

export { createTokenPair, authentication, verifyJWT };
