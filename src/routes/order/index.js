import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import orderController from '../../controller/order.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

router.use(authentication)

router.post('/review', asyncHandler(orderController.checkoutReview));


export default router;
