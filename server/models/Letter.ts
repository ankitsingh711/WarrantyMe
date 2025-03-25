import { Schema, model } from 'mongoose';
import { ILetter } from '../types';

const letterSchema = new Schema<ILetter>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  googleDriveFileId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

letterSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default model<ILetter>('Letter', letterSchema); 