import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/index.js';

const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use(config.apiPrefix, routes);

  // Root route
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Smart Inventory & Environment Monitor API',
      version: '1.0.0',
    });
  });

  // 404 handler
  app.use(notFound);

  // Error handler
  app.use(errorHandler);

  return app;
};

export default createApp;

