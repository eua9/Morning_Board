import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Database
import { initializeDatabase, checkDatabaseHealth } from './database/init';

// Controllers
import { AuthController } from './controllers/AuthController';
import { DashboardController } from './controllers/DashboardController';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const getCorsOptions = () => {
  const env = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.CORS_ORIGIN;

  // Default allowed origins for development
  const defaultDevOrigins = [
    'http://localhost:19006', // Expo default port
    'http://localhost:19000', // Expo alternative port
    'http://localhost:19001', // Expo alternative port
    'http://localhost:8081', // React Native Metro bundler
    'http://localhost:3000', // Backend itself (for testing)
    'http://127.0.0.1:19006',
    'http://127.0.0.1:19000',
    'http://127.0.0.1:19001',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
  ];

  if (env === 'production') {
    // Production: Use specific origins from environment variable
    if (corsOrigin) {
      const origins = corsOrigin.split(',').map((origin) => origin.trim());
      return {
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      };
    }
    // If no CORS_ORIGIN set in production, deny all (security)
    return { origin: false };
  }

  // Development: Allow configured origins or default dev origins
  if (corsOrigin) {
    const origins = corsOrigin.split(',').map((origin) => origin.trim());
    return {
      origin: [...origins, ...defaultDevOrigins],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    };
  }

  // Default: Allow all origins in development (for easier local testing)
  return {
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
};

// Middleware
app.use(helmet()); // Security headers
app.use(cors(getCorsOptions())); // Configure CORS based on environment
app.use(morgan('combined')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Simple status endpoint for basic health check
app.get('/status', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
  });
});

// Health check endpoint (includes database health)
app.get('/health', (_req: Request, res: Response) => {
  const dbHealthy = checkDatabaseHealth();
  
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'OK' : 'SERVICE_UNAVAILABLE',
    message: 'Morning Board API is running',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Morning Board API',
    version: '1.0.0',
  });
});

// Authentication routes
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/logout', AuthController.logout);
app.post('/api/auth/reset-password', AuthController.requestPasswordReset);
app.post('/api/auth/reset', AuthController.resetPassword);
app.get('/api/auth/verify', AuthController.verifyToken);
app.post('/api/auth/refresh', AuthController.refreshToken);

// Dashboard routes
app.get('/api/dashboard', DashboardController.getDashboard);
app.get('/api/dashboard/widget/:type', DashboardController.getWidgetData);
app.put('/api/dashboard/layout', DashboardController.updateLayout);
app.post('/api/dashboard/widget', DashboardController.addWidget);
app.delete('/api/dashboard/widget/:id', DashboardController.removeWidget);
app.post('/api/dashboard/sync', DashboardController.syncWidgets);
app.get('/api/dashboard/widget/:id/config', DashboardController.getWidgetConfig);
app.put('/api/dashboard/widget/:id/config', DashboardController.updateWidgetConfig);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      const corsConfig = getCorsOptions();
      const allowedOrigins = Array.isArray(corsConfig.origin)
        ? corsConfig.origin.join(', ')
        : corsConfig.origin === true
        ? 'All origins (development mode)'
        : corsConfig.origin === false
        ? 'None (production mode - set CORS_ORIGIN)'
        : String(corsConfig.origin);

      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Database: ${process.env.DB_TYPE || 'sqlite'} initialized successfully`);
      console.log(`🌐 CORS: ${allowedOrigins}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing server');
  process.exit(0);
});

// Start the server only if not running in test environment
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  startServer();
}

export default app;

