import { Request, Response, Router } from 'express';
import healthRoutes from './health.js';

import userRouter from './users.js';

const router = Router();


router.use('/health', healthRoutes);
router.use('/users', userRouter);


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