import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import notificationController from '../../controller/notification.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

router.use(authentication)

router.get('/', asyncHandler(notificationController.listNotiByUser));


export default router;
