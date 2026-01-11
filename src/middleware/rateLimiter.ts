import expressRateLimit from 'express-rate-limit';
import { ManyRequestError429 } from '../errors/ManyRequestError429.js';
import { NextFunction, Request, Response } from 'express';

// Opciones comunes a TODOS los limiters
const baseLimiterOptions = {
  standardHeaders: true,    // Envia RateLimit-* headers
  legacyHeaders: false,     // No usar X-RateLimit-* antiguos
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    // Aquí puedes pasar info extra a tu error si quieres
    throw new ManyRequestError429();
  },
};

// Factory para crear limiters con mínima repetición
const createLimiter = ({ windowMs, max }: { windowMs: number; max: number }) =>
  expressRateLimit({
    windowMs,
    max,
    ...baseLimiterOptions,
  });

// ========= RATE LIMIT GLOBAL =========
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,   // 15 minutos
  max: 100,                   // 100 requests por IP en 15 min
});

// ========= CREACIÓN DE CUENTAS =========
export const createAccountLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,   // 1 hora
  max: 5,                     // 5 registros por IP en 1 hora
});

// ========= LOGIN =========
export const loginLimiter = createLimiter({
  windowMs: 1 * 60 * 1000,    // 1 minuto
  max: 10,                    // 10 intentos de login por IP en 1 min
});
