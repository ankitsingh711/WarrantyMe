import "dotenv/config";
import express, {  Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import letterRoutes from "./routes/letters";
import { productionConfig } from "./config/production";
import { createServer } from 'http';
import { setupWebSocket } from './services/socket';

const app: Application = express();
const server = createServer(app);
setupWebSocket(server);
const isProduction = process.env.NODE_ENV === "production";

// Add initial console log
console.log('Starting server...');

// Middleware
app.use(
  cors(
    isProduction
      ? productionConfig.cors
      : {
          origin: process.env.CLIENT_URL,
          credentials: true,
        }
  )
);

app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    ...(isProduction ? productionConfig.session : {}),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/letters", letterRoutes);

// Error handling
app.use(errorHandler);

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5100;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`👉 Client URL: ${process.env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

export default app;