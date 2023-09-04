import express from 'express';
import productController from '../../controller/product.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import { authentication } from '../../auth/authUtils.js';

const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:id', asyncHandler(productController.findProductById));

/**
 *  AUTHENTICATION (Routers need authentication behind). 
 */
router.use(authentication);

//GET
router.get('/drafts/all', asyncHandler(productController.findAllDraftForShop));
router.get('/published/all', asyncHandler(productController.findAllPublishForShop));


//POST
router.post('', asyncHandler(productController.createProduct)); 


//PUSH
router.put('/publish/:id', asyncHandler(productController.publishProductByShop)); 
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop)); 

router.patch('/:id', asyncHandler(productController.updateProduct)); 

export default router;
