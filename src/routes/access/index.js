import express from 'express';
import accessController from '../../controller/access.controller.js';
import { asyncHandler } from '../../auth/checkAuth.js';

const router = express.Router();

router.post('/shop/signup', asyncHandler(accessController.signUp));

export default router;
