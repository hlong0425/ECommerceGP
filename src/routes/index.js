import express from 'express';
import access from './access/index.js';

const router = express.Router();

router.use('/v1/api', access);

export default router;
