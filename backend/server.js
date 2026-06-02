import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './src/routes/auth.js';
import messageRoutes from './src/routes/messages.js';
import journalRoutes from './src/routes/journal.js';
import goalRoutes from './src/routes/goals.js';
import photoRoutes from './src/routes/photos.js';
import questionRoutes from './src/routes/questions.js';
import eventRoutes from './src/routes/events.js';
import timelineRoutes from './src/routes/timeline.js';
import analyticsRoutes from './src/routes/analytics.js';
import streakRoutes from './src/routes/streaks.js';

// Import middleware
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';
import { requestLogger } from './src/middleware/requestLogger.js';

// Import WebSocket handler
import setupWebSocket from './src/websocket/handlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// MIDDLEWARE
// =====================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// =====================================================
// STATIC FILES
// =====================================================

app.use('/uploads', express.static('uploads'));

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use('/api/auth', authRoutes);

// Messages
app.use('/api/messages', messageRoutes);

// Journal
app.use('/api/journal', journalRoutes);

// Goals
app.use('/api/goals', goalRoutes);

// Photos
app.use('/api/photos', photoRoutes);

// Daily Questions
app.use('/api/questions', questionRoutes);

// Events
app.use('/api/events', eventRoutes);

// Timeline
app.use('/api/timeline', timelineRoutes);

// Analytics
app.use('/api/analytics', analyticsRoutes);

// Streaks
app.use('/api/streaks', streakRoutes);

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler (must be last)
app.use(errorHandler);

// =====================================================
// SERVER SETUP
// =====================================================

const server = http.createServer(app);

// WebSocket configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Setup WebSocket handlers
setupWebSocket(io);

// =====================================================
// START SERVER
// =====================================================

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Private Connection Platform          ║
║   Backend Server                       ║
╚════════════════════════════════════════╝

🚀 Server running on port: ${PORT}
📝 Environment: ${process.env.NODE_ENV}
🌐 Frontend URL: ${process.env.FRONTEND_URL}
📊 Database: ${process.env.DB_NAME}

✅ Server is ready to accept connections
  `);
});

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
