import express from 'express';
import { redirectToDAuth, handleCallback } from '../controllers/dauthController.js';

const router = express.Router();

router.get('/login', redirectToDAuth);
router.get('/callback', handleCallback);

export default router;