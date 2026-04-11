import express from 'express'
import { addToWishlist, getWishlist, getWishlistProducts, removeFromWishlist, removeWishlistProduct } from '../controllers/wishlist.controller.js';
const router = express.Router();
import {isAuthenticated} from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

router.post('/add',isAuthenticated, addToWishlist)
router.delete('/remove',isAuthenticated, removeFromWishlist);
router.get('/get-user-wishlist/:user_id', getWishlist);
router.get('/get-wishlist-products',getWishlistProducts)
router.delete('/remove-wishlist-product/:product_id', isAdmin, removeWishlistProduct)
export default router