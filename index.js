import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import textRoutes from './routes/textRoutes.js';

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));

app.use(json());

app.use('/api/texts', textRoutes);

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error(err));