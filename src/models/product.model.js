import { Model, model, Schema } from 'mongoose'; // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: { type: String, require: true },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: Schema.Types.String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String },
}, {
    collection: 'clothes',
    timestamps: true
})

const electronicSchema = new Schema({
    manufacture: { type: String, require: true },
    size: { type: String },
    material: { type: String }
}, {
    collection: 'electronics',
    timestamps: true
})

export default {
    product: model(DOCUMENT_NAME, productSchema),
    electronics: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema),
}