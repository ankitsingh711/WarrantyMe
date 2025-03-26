export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
}

export interface Letter {
  _id: string;
  title: string;
  content: string;
  user: string | User;
  googleDriveFileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  status: 'error';
  stack?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
} 