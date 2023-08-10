'use strict';

import { model, Schema } from 'mongoose'; // Erase if already required

// 1. install "Mongo Snippers for Nodejs"
// 2. type: "!mdbgum" to generate mongodb schema model quickly

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

var keyTokenSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);
