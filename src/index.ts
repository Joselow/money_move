import app from './app.js';
import { config } from './config/env.js';

const startServer = async (): Promise<void> => {
  try {
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🌐 API URL: http://localhost:${config.port}/api`);
      console.log(`💚 Health check: http://localhost:${config.port}/api/health`);
    });

    // Manejo graceful shutdown
    const gracefulShutdown = (signal: string): void => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 