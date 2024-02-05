import { model, Schema } from 'mongoose';


// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema({
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    noti_receivedId: {
        type: Number,
        required: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_options: {
        type: Object,
        default: {}
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
export default model(DOCUMENT_NAME, notificationSchema);
