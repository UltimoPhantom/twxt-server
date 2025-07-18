import 'dotenv/config';
import { connect } from 'mongoose';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import app from '../app.js';  // your Express app

let conn = null;

async function getMongoUri() {
  const client = new SSMClient({ region: 'us-east-1' });
  const cmd = new GetParameterCommand({
    Name: 'twxt-MONGO_URI',
    WithDecryption: true,
  });
  const res = await client.send(cmd);
  return res.Parameter.Value;
}

async function ensureDb() {
  if (!conn) {
    const uri = await getMongoUri();
    conn = await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  }
}

export default async function handler(req, res) {
  try {
    await ensureDb();
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
}

