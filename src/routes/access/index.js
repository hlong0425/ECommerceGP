import express from 'express';
import { authentication } from '../../auth/authUtils.js';
import accessController from '../../controller/access.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';

const router = express.Router();

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

//authentication
router.use(authentication);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refresh-token', asyncHandler(accessController.refreshToken));


export default router;
