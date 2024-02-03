import { model, Schema } from 'mongoose'; // Erase if already required


// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema({
	comment_productId: {
		type: Schema.Types.ObjectId,
		ref: 'Product'
	},
	comment_userId: {
		type: Schema.Types.Number,
		default: 1
	},
	comment_content: {
		type: Schema.Types.String,
		default: 'text'
	},
	comment_left: {
		type: Schema.Types.Number,
		default: 0,
	},
	comment_right: {
		type: Schema.Types.Number,
		default: 0,
	},
	comment_parentId: {
		type: Schema.Types.ObjectId,
		ref: DOCUMENT_NAME
	},
	isDeleted: {
		type: Schema.Types.Boolean,
		default: false
	},
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
export default model(DOCUMENT_NAME, commentSchema);
