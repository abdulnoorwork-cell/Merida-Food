import express from 'express'
import { adminLogin, forgotPassword, getUser, login, resetPassword, signup, updateUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.js'
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user-data/:user_id', isAuthenticated, getUser);
router.put('/update/:user_id',isAuthenticated, updateUser);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;