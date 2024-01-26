import { model, Schema } from 'mongoose'; // Erase if already required


// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'inventory';
const COLLECTION_NAME = 'inventories';

const inventorySchema = new Schema({
  inven_productId: {
    type: Schema.Types.ObjectId, ref: 'Product'
  },
  inven_location: {
    type: Schema.Types.String,
  },
  inven_stock: {
    type: Schema.Types.Number, require: true
  },
  inven_shopId: {
    type: Schema.Types.ObjectId, ref: 'Shop'
  },
  inven_reservations: {
    type: Schema.Types.Array, default: []
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
}
);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);
