import express from 'express';
import {
  createCustomOrder, getAllCustomOrdersAdmin,
  updateCustomOrderStatusAdmin, deleteCustomOrderAdmin
} from '../controllers/custom-order.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/custom-orders', createCustomOrder);
router.get('/custom-orders/admin', authenticate, isAdmin, getAllCustomOrdersAdmin);
router.put('/custom-orders/admin/:id', authenticate, isAdmin, updateCustomOrderStatusAdmin);
router.delete('/custom-orders/admin/:id', authenticate, isAdmin, deleteCustomOrderAdmin);

export default router;
