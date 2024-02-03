import { Types } from 'mongoose';
import { NotFoundError } from '../core/error.response.js';
import commentModel from '../models/comment.model.js';

class CommentService {
	static async createComment({ userId, productId, content, parentCommentId = null }) {
		const comment = new commentModel({
			comment_productId: productId,
			comment_content: content,
			comment_userId: userId,
			comment_parentId: parentCommentId,
		});

		let rightValue;
		if (parentCommentId) {
			/**
			 * 1. Find parent => parent
			 * 2. 
			 * - Update all comment:  comment.right += 2 if comment.right >= parent.right. 
			 * - Update all commnent: comment.left += 2 if comment.left > comment.right.
			 * 3. Update newComment
			 * - newComment.left = parent.right
			 * - newComment.right = parent.right + 1 
			 */

			// 1.
			const parentCommnet = await commentModel.findById(parentCommentId);
			if (!parentCommnet) throw new NotFoundError('Comment not found.');

			rightValue = parentCommnet.comment_right;

			// 2.
			await commentModel.updateMany({
				comment_productId: new Types.ObjectId(productId),
				comment_right: { $gte: rightValue },
			}, {
				$inc: { comment_right: 2 }
			})

			await commentModel.updateMany({
				comment_productId: new Types.ObjectId(productId),
				comment_left: { $gt: rightValue },
			}, {
				$inc: { comment_left: 2 }
			});
		} else {
			const maxRightValue = await commentModel.findOne({
				comment_productId: new Types.ObjectId(productId)
			}, 'comment_right', { sort: { comment_right: -1 } });

			if (maxRightValue) {
				rightValue = maxRightValue.comment_right + 1
			} else {
				rightValue = 1
			}
		}

		comment.comment_left = rightValue;
		comment.comment_right = rightValue + 1;

		await comment.save();
		return comment;
	}

	static async getCommentsByParentId({
		productId,
		parentCommentId = null,
		limit = 50,
		offset = 0
	}) {
		if (parentCommentId) {
			const parent = await commentModel.findById(parentCommentId);
			if (!parent) throw new NotFoundError('Not found comment for product');

			const comments = await commentModel.find({
				comment_productId: new Types.ObjectId(productId),
				comment_left: { $gt: parent.comment_left },
				comment_right: { $lte: parent.comment_right },
			}).sort({
				comment_left: 1
			});

			return comments;
		} else {
			const comments = await commentModel.find({
				comment_productId: new Types.ObjectId(productId),
			}).select({
				comment_left: 1,
				comment_right: 1,
				comment_content: 1,
				comment_parentId: 1
			}).sort({
				comment_left: 1
			});

			return comments;
		}
	}

	static async deleteCommentByParent(parentCommentId) {
		console.log('commentId', parentCommentId)
		const parent = await commentModel.findById(parentCommentId);
		if (!parent) throw new NotFoundError('Not found comment for product');

		const width = parent.comment_right - parent.comment_left + 1;

		const deletedComments = await commentModel.deleteMany({
			comment_left: { $gte: parent.comment_left },
			comment_right: { $lte: parent.comment_right },
		})

		await commentModel.updateMany({
			comment_left: { $gt: parent.comment_right },
		}, {
			$inc: { comment_left: -width },
		}, { returnOriginal: true })

		await commentModel.updateMany({
			comment_right: { $gt: parent.comment_right },
		}, {
			$inc: { comment_right: -width },
		}, { returnOriginal: true })

		return {
			deletedComments,
		}
	};
}


export default CommentService;
