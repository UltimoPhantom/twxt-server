import 'dotenv/config'; // Loads environment variables
import { connect } from 'mongoose';
import app from '../app.js'; // Import your Express app

async function getMongoUri() {
  return process.env.MONGO_URI;
}

async function startServer(req, res) {
  try {
    const mongoUri = await getMongoUri();
    if (!mongoUri) {
      throw new Error('Mongo URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Serve requests using the Express app (serverless)
    app(req, res); // Pass the request and response to the Express app
  } catch (err) {
    console.error('Failed to start server:', err);
    res.status(500).send('Internal Server Error');
  }
}

// Export the function that Vercel can invoke
export default startServer;
