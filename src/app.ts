import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import 'dotenv/config';

import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';


const app = express();

// Configuración de proxy (Nginx delante)
app.set('trust proxy', 1);


// Aplicas el rate limit a TODA la API (todo lo que cuelga de /api)
app.use('/api', globalLimiter);

// =====================================

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

console.log(process.env.CORS_ORIGIN);


// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para parsear cookies
app.use(cookieParser());

// Logging con Morgan en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}


app.get('/api/test', (req, res) => {
  res.json({ ip: req.ip });
});

// Rutas de la API
app.use('/api', routes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware para manejo de errores
app.use(errorHandler);

export default app; 