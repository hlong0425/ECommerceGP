'use strict';

import apiKeyModel from '../models/apiKey.model.js';
import crypto from 'crypto';

const findById = async (key) => {  
  return await apiKeyModel.findOne({ key, status: true }).lean();
};


const seedNewKey = async() => {
    const newKey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString('hex'),
      status: true,
      permissions: ['0000'],
    });
};

export { findById };
