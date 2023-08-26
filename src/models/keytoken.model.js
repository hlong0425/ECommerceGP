import { model, Schema } from 'mongoose'; // Erase if already required

// 1. install "Mongo Snippers for Nodejs"
// 2. type: "!mdbgum" to generate mongodb schema model quickly

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'shop',
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
    refreshToken: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);
