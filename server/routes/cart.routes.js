import express from 'express';
import { addToCart, getCart, quantityUpdated, removeFromCart, totalItems} from '../controllers/cart.controller.js';
import {isAuthenticated} from '../middleware/auth.js'
const router = express.Router();

router.post('/addtocart/:user_id',isAuthenticated, addToCart);
router.get('/getcartitems/:user_id',getCart);
router.get('/totalitems/:user_id', totalItems);
router.post('/removefromcart/:user_id',isAuthenticated,removeFromCart);
router.put('/update-quantity/:user_id',isAuthenticated,quantityUpdated);
export default router;