import express, { json } from 'express';
import cors from 'cors';
import textRoutes from './routes/textRoutes.js';
import userRoutes from './routes/userRoutes.js';

export function createApp() {
  const app = express();

  app.options('*', cors());

  app.use(cors({
    origin: function(origin, callback) {
      if(!origin) return callback(null, true);
      
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
  }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  app.get('/cors-test', (req, res) => {
    res.json({ 
      message: 'CORS is working!',
      origin: req.headers.origin || 'No origin provided'
    });
  });

  app.use(json());
  app.use('/api/texts', textRoutes);
  app.use('/api/users', userRoutes);
  
  return app;
}

const app = createApp();
export default app;
