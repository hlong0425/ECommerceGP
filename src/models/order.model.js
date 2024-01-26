import { model, Schema } from 'mongoose'; // Erase if already required

// 1. install "Mongo Snippers for Nodejs"
// 2. type: "!mdbgum" to generate mongodb schema model quickly

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Order';

var orderSchema = new Schema(
    {
        order_userId: { type: Number, require: true },
        order_checkout: { // {totalPrice, totalApplyDiscount, feeShip }
            type: Object,
            default: {},
        },
        order_shipping: { // { street, city, state, country } 
            type: Object, default: {}
        },
        order_payment: {
            type: Object, default: {}
        },
        order_products: { type: Array, require: true },
        order_trackingNumber: { type: String, default: '#000000000' },
        order_status: {
            type: String,
            enum: ['pending', 'confirm', 'shipped', 'cancelled', 'delivered'],
            default: 'pending'
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//Export the model
export default model(DOCUMENT_NAME, orderSchema);
