import express from 'express';
import {
  createOrder, verifyPayment, getMyOrders, getOrderById,
  getOrderByNumber, getAllOrdersAdmin, updateOrderAdmin, exportOrdersCsv
} from '../controllers/order.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public & Customer order management
router.post('/orders', createOrder); // Auth optional for guest checkout, but if logged in, userId is attached in controller
router.post('/orders/verify', verifyPayment);
router.get('/orders/my', authenticate, getMyOrders);
router.get('/orders/track/:number', getOrderByNumber);
router.get('/orders/detail/:id', authenticate, getOrderById);

// Admin order management
router.get('/orders/admin', authenticate, isAdmin, getAllOrdersAdmin);
router.put('/orders/admin/:id', authenticate, isAdmin, updateOrderAdmin);
router.get('/orders/admin/export', authenticate, isAdmin, exportOrdersCsv);

export default router;
