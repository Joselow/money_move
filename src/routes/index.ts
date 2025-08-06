import { Request, Response, Router } from 'express';
import healthRoutes from './health.js';

import userRouter from './users.js';
import accountRouter from './accounts.js';
import authRouter from './auth.js';
import configRouter from './config.js';
import categoryRouter from './categories.js';
import transactionRouter from './transactions.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();


router.use('/health', healthRoutes);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/config', authenticateToken, configRouter);
router.use('/accounts', authenticateToken, accountRouter);
router.use('/categories', authenticateToken, categoryRouter);
router.use('/transactions', authenticateToken, transactionRouter);


// Ruta por defecto
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Money Move API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    },
  });
});

export default router;