import { connect } from 'mongoose';
import { config } from 'dotenv';
import app from './app.js';

config();

const port = process.env.PORT || 5000;

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error(err));
