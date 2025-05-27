import express from 'express'
import { createOrder, getAllOrders, getOrderById} from '../controllers/orderController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = new express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware,  getOrderById);

export default router;
