import express, { json } from 'express';
import cors from 'cors';
import textRoutes from './routes/textRoutes.js';
import userRoutes from './routes/userRoutes.js';

export function createApp() {
  const app = express();

  const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  };

  app.use(cors(corsOptions));

  // CORS Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // Simple CORS Test
  app.get('/cors-test', (req, res) => {
    res.json({
      message: 'CORS is working!',
      origin: req.headers.origin || 'No origin provided'
    });
  });

  // JSON Body Parser
  app.use(json());
  
  // Define Routes
  app.use('/api/texts', textRoutes);
  app.use('/api/users', userRoutes);

  return app;
}

const app = createApp();
export default app;
