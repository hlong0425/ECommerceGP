import express from 'express';
import accessController from '../../controller/access.controller.js';
const router = express.Router();

router.post('/shop/signup', accessController.signUp);

export default router;
