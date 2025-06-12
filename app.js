import express, { json } from 'express';
import cors from 'cors';
import textRoutes from './routes/textRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Create Express app
export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }),
  );
  app.use(json());
  app.use('/api/texts', textRoutes);
  app.use('/api/users', userRoutes);
  
  return app;
}

// Default export for backward compatibility
const app = createApp();
export default app;
