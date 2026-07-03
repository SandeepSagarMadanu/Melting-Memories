import express from 'express';
import { getSettings, updateSettingsAdmin } from '../controllers/setting.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/settings', getSettings);
router.put('/settings/admin', authenticate, isAdmin, updateSettingsAdmin);

export default router;
