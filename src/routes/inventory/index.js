import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import inventoryController from '../../controller/inventory.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

router.use(authentication)

router.post('/', asyncHandler(inventoryController.addStock));


export default router;
