import express from 'express';
import {
  createReview, getApprovedReviews, getFeaturedReviews,
  getAllReviewsAdmin, updateReviewStatusAdmin, deleteReviewAdmin
} from '../controllers/review.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/reviews', createReview); // Optionally authenticated, handles username if guest
router.get('/reviews/product/:productId', getApprovedReviews);
router.get('/reviews/featured', getFeaturedReviews);

router.get('/reviews/admin', authenticate, isAdmin, getAllReviewsAdmin);
router.put('/reviews/admin/:id', authenticate, isAdmin, updateReviewStatusAdmin);
router.delete('/reviews/admin/:id', authenticate, isAdmin, deleteReviewAdmin);

export default router;
