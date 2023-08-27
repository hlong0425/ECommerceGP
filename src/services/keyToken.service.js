import keytokenModel from '../models/keytoken.model.js';
import { Mongoose, Types } from 'mongoose';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken, refreshTokenUsed }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey, privateKey, refreshToken, refreshTokenUsed: []
      }
      const options = {
        upsert: true, 
        new: true
      }

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options); 
      return tokens ? tokens.publicKey : null

    } catch (error) {
      return error;
    }
  };  

  static findByUserId = async ( userId ) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async ( id ) => {
    return await keytokenModel.deleteOne({ _id: id });
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({refreshTokenUsed: { $in: [ refreshToken ] }});
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  }; 

  static deleteKeyById = async (userId) => {
    return await keytokenModel.findOneAndDelete({user: new Types.ObjectId(userId)});
  };

  static updateTokens = async({ keyId, refreshToken, refreshTokenUsed }) => {
    return await keytokenModel.updateOne(
    { _id: keyId },
    { 
      $set: { refreshToken },
      $addToSet: { refreshTokenUsed }
    });
  }
}

export default KeyTokenService;
