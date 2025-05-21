import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const textSchema = new Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  text_content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'archive'],
    default: 'active',
  },
  added_date: {
    type: Date,
    default: Date.now,
  },
});

export default model('Text', textSchema);
