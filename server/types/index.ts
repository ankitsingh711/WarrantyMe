import { Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt: Date;
}

export interface ILetter extends Document {
  title: string;
  content: string;
  user: IUser['_id'];
  googleDriveFileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
} 