import { model, Schema } from 'mongoose'; // Erase if already required

// 1. install "Mongo Snippers for Nodejs"
// 2. type: "!mdbgum" to generate mongodb schema model quickly

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

var userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxLength: 150,
    },
    password: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    verfify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Schema.Types.Array,
      default: [],
    },
    email: {
      type: Schema.Types.String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);


//Export the model
export default model(DOCUMENT_NAME, userSchema);
