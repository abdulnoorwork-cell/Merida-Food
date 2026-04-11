import express from 'express'
import { addProduct, deleteProduct, getCategoryAllProducts, getCategoryProducts, getLatestCategoryProducts, getLatestProducts, getLimitProducts, getProducts, getSearchProducts, getSingleProduct,getSuggestions } from '../controllers/product.controller.js';
import isAdmin from '../middleware/isAdmin.js';
const router = express.Router();

router.post('/add',isAdmin, addProduct);
router.get('/get-products',getProducts);
router.get('/latest-products',getLatestProducts);
router.get('/category-products/:category',getCategoryProducts);
router.get('/latest-category-products/:category',getLatestCategoryProducts);
router.get('/getLimitProducts', getLimitProducts)
router.get('/product-detail/:productId',getSingleProduct);
router.delete('/delete/:productId',isAdmin, deleteProduct);
router.get('/search-products',getSearchProducts);
router.get('/get-suggestions', getSuggestions);
router.get('/category/:category', getCategoryAllProducts)

export default router;