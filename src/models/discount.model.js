import { model, Schema } from 'mongoose'; // Erase if already required


// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema({
    discount_name: { type: Schema.Types.String, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, required: true },
    discount_description: { type: Schema.Types.String, required: true },
    discount_type: { type: Schema.Types.String, default: 'fix_amount' },
    discount_value: { type: Schema.Types.String, required: true },
    discount_code: { type: Schema.Types.String, required: true },
    discount_start_date: { type: Schema.Types.Date, required: true },
    discount_end_date: { type: Schema.Types.Date, required: true }, 
    discount_max_uses: { type: Schema.Types.Number, required: true }, // toi da discount dc su dung
    discount_uses_count: { type: Schema.Types.Number, required: true }, // discount da su dung
    discount_users_used: { type: Schema.Types.Array, default: [] }, // user da su dung
    discount_max_per_user: { type: Schema.Types.Number, required: true }, // so luong cho phep toi da duoc su dung moi user.
    discount_min_per_user: { type: Schema.Types.Number, required: true },
    discount_min_order_value: { type: Schema.Types.Number, required: true },
    discount_is_active: { type: Schema.Types.Boolean, default: true },
    discount_applies_to: { type: Schema.Types.String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Schema.Types.Array, default: [] },
  }, {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, discountSchema);
