import app from './app.js';

const startServer = async (): Promise<void> => {
  try {
    const server = app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${process.env.PORT}/api`);
      console.log(`💚 Health check: http://localhost:${process.env.PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 