import mongoose from 'mongoose';

interface CorsConfig {
  origin: string;
  credentials: boolean;
}

interface SessionConfig {
  cookie: {
    secure: boolean;
    sameSite: 'none' | 'lax' | 'strict';
  };
  proxy: boolean;
}

interface MongoDBConfig {
  options: mongoose.ConnectOptions;
}

interface ProductionConfig {
  cors: CorsConfig;
  session: SessionConfig;
  mongodb: MongoDBConfig;
}

export const productionConfig: ProductionConfig = {
  cors: {
    origin: process.env.CLIENT_URL!,
    credentials: true
  },
  session: {
    cookie: {
      secure: true,
      sameSite: 'none'
    },
    proxy: true
  },
  mongodb: {
    options: {}
  }
}; 