import { Request, Response, Router } from 'express';
import healthRoutes from './health.js';
import { db } from '../database/index.js';
import { sql } from 'drizzle-orm';

const router = Router();


router.use('/health', healthRoutes);

router.use('/user', async (req: Request, res: Response) => {

    const usersResult = await db.execute(sql`SELECT * FROM users`);

    return res.json({
        success: true,
        data: usersResult,
        message: 'User routes',
    });
});

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