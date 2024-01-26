import express from 'express';
import { apiKey, permission } from '../auth/checkAuth.js';
import access from './access/index.js';
import cart from './cart/index.js';
import discount from './discount/index.js';
import inventory from './inventory/index.js';
import order from './order/index.js';
import product from './product/index.js';

const router = express.Router();

// check apiKey exist
router.use(apiKey);

// check permission: 0000 => full permission CRUD
router.use(permission('0000'));

router.use('/v1/api', access);

router.use('/v1/api/product', product);
router.use('/v1/api', discount);
router.use('/v1/api/cart', cart);
router.use('/v1/api/order', order);
router.use('/v1/api/inventory', inventory);

export default router;
