import express from 'express';
import {
  getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog
} from '../controllers/blog.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);

router.post('/blogs', authenticate, isAdmin, createBlog);
router.put('/blogs/:id', authenticate, isAdmin, updateBlog);
router.delete('/blogs/:id', authenticate, isAdmin, deleteBlog);

export default router;
