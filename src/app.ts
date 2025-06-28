import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging con Morgan en desarrollo
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rutas de la API
app.use('/api', routes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware para manejo de errores
app.use(errorHandler);

export default app; 