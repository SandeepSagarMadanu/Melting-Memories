import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import seed helpers
import { seedAdmin } from './controllers/auth.controller.js';
import { seedSettings } from './controllers/setting.controller.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import customOrderRoutes from './routes/custom-order.routes.js';
import reviewRoutes from './routes/review.routes.js';
import blogRoutes from './routes/blog.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import settingRoutes from './routes/setting.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For dev ease, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Seeding function
const runSeeders = async () => {
  console.log('Running database seeders...');
  await seedAdmin();
  await seedSettings();
};

// Simple Healthcheck API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // Includes /categories and /products
app.use('/api', orderRoutes); // Includes /orders
app.use('/api', customOrderRoutes); // Includes /custom-orders
app.use('/api', reviewRoutes); // Includes /reviews
app.use('/api', blogRoutes); // Includes /blogs
app.use('/api', couponRoutes); // Includes /coupons
app.use('/api', settingRoutes); // Includes /settings
app.use('/api', dashboardRoutes); // Includes /dashboard

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred on the server.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Melting Memories server running on port ${PORT}`);
  
  // Run Prisma database check and seeders
  try {
    await runSeeders();
  } catch (error) {
    console.error('❌ Seeder execution skipped or failed:', error);
  }
});
