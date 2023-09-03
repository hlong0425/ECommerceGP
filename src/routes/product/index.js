import express from 'express';
import productController from '../../controller/product.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import { authentication } from '../../auth/authUtils.js';

const router = express.Router();

//authentication
router.use(authentication);

//GET
router.get('/drafts/all', asyncHandler(productController.findAllDraftForShop));
router.get('/published/all', asyncHandler(productController.findAllPublishForShop));
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));


//POST
router.post('', asyncHandler(productController.createProduct)); 


//PUSH
router.put('/publish/:id', asyncHandler(productController.publishProductByShop)); 
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop)); 





export default router;
