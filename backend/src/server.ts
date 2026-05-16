import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './database/connection';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import subscriptionRoutes from './routes/subscriptions';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();
const PORT = process.env.API_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

// Database Connection & Server Start
const startServer = async () => {
  try {
    // Sync Database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synced');

    // Start Server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
