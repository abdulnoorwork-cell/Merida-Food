import express from 'express'
import { confirmOrder, deleteUserOrder, fetchAllOrders, getLatestOrders, getUserOrders, placeOrder, updateOrderStatus } from '../controllers/order.controller.js';
import isAdmin from '../middleware/isAdmin.js';
import {isAuthenticated} from '../middleware/auth.js'
const router = express.Router();

router.post('/place-order',isAuthenticated,placeOrder);
router.post('/confirm-order', confirmOrder)
router.get('/user-orders/:user_id',getUserOrders);
router.get('/get-orders', isAdmin,fetchAllOrders);
router.get('/get-latest-orders',isAdmin, getLatestOrders);
router.delete('/delete-order/:order_id',isAuthenticated,deleteUserOrder);
router.put('/update-order/:order_id', isAdmin, updateOrderStatus);

export default router;