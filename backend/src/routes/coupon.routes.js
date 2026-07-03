import express from 'express';
import {
  validateCoupon, getCouponsAdmin, createCouponAdmin,
  updateCouponAdmin, deleteCouponAdmin
} from '../controllers/coupon.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/coupons/validate', validateCoupon);

router.get('/coupons/admin', authenticate, isAdmin, getCouponsAdmin);
router.post('/coupons/admin', authenticate, isAdmin, createCouponAdmin);
router.put('/coupons/admin/:id', authenticate, isAdmin, updateCouponAdmin);
router.delete('/coupons/admin/:id', authenticate, isAdmin, deleteCouponAdmin);

export default router;
