import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  next();
}; 