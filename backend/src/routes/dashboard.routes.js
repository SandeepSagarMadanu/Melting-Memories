import express from 'express';
import { getDashboardAnalytics } from '../controllers/dashboard.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard/analytics', authenticate, isAdmin, getDashboardAnalytics);

export default router;
