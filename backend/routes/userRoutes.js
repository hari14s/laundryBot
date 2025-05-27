import express from 'express'
import { getDashboard, getProfile, updateProfile } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = new express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

export default router;