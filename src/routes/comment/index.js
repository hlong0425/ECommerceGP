import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import commentController from '../../controller/comment.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

router.use(authentication);

router.post('', asyncHandler(commentController.createComment));
router.get('', asyncHandler(commentController.getCommentByParentId));
router.delete('', asyncHandler(commentController.deleteComment));

export default router;
