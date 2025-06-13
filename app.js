import express, { json } from 'express';
import cors from 'cors';
import textRoutes from './routes/textRoutes.js';
import userRoutes from './routes/userRoutes.js';

export function createApp() {
  const app = express();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  app.use(cors({
    origin: clientUrl,
    credentials: true
  }));

  app.use(json());
  app.use('/api/texts', textRoutes);
  app.use('/api/users', userRoutes);
  
  return app;
}

const app = createApp();
export default app;
