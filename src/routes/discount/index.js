import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import discountController from '../../controller/discount.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

router.post('/discount/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/discount/list_product_code', asyncHandler(discountController.getAllDiscountsWithProducts));

router.use(authentication)

router.post('/discount', asyncHandler(discountController.createDiscountCode));
router.get('/discount', asyncHandler(discountController.getAllDiscountCodesByShop));



export default router;
