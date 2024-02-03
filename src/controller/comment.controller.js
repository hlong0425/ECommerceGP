import { OK } from '../core/success.response.js';
import CommentService from '../services/comment.service.js';

class CommentController {
  createComment = async (req, res, next) => {
    new OK({
      message: 'create comment success.',
      metadata: await CommentService.createComment(req.body)
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    new OK({
      message: 'delete comment success.',
      metadata: await CommentService.deleteCommentByParent(req.query.commentId)
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    new OK({
      message: 'get comment success.',
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res);
  };
}

export default new CommentController();
