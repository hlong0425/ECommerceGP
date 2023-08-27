import express from 'express';
import access from './access/index.js';
import { apiKey, permission } from '../auth/checkAuth.js';
import product from './product/index.js'

const router = express.Router();

// check apiKey exist
router.use(apiKey);

// check permission: 0000 => full permission CRUD
router.use(permission('0000'));

router.use('/v1/api', access);
router.use('/v1/api/product', product);

export default router;
