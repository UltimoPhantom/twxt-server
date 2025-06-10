import { connect } from 'mongoose';
import app from './app.js';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const port = process.env.PORT || 5000;

async function getMongoUri() {
  const client = new SSMClient({ region: 'us-east-1' });
  const command = new GetParameterCommand({
    Name: 'twxt-MONGO_URI',
    WithDecryption: true,
  });
  const response = await client.send(command);
  return response.Parameter.Value;
}

getMongoUri()
  .then((mongoUri) => {
    return connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  })
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error('Failed to start server:', err));
