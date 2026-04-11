import express from 'express';
import { addReview, adminReply, getAllReviews, getProductReviews, getSingleReview, productRating } from '../controllers/reviews.controller.js';
import {isAuthenticated} from '../middleware/auth.js'
import isAdmin from '../middleware/isAdmin.js'

const router = express.Router();

router.post('/add', isAuthenticated, addReview);
router.get('/get-reviews/:product_id',getProductReviews)
router.get('/get-product-rating/:product_id',productRating)
router.get('/all-reviews', getAllReviews)
router.get('/get-single-review/:id',getSingleReview)
router.post('/reply/add', isAdmin, adminReply)

export default router;