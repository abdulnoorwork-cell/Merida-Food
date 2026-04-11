import express from 'express'
import { addBlog, deleteBlog, getBlogs, getLatestBlogs, singleBlog, updateBlog } from '../controllers/blog.controller.js';
import isAdmin from '../middleware/isAdmin.js';
const router = express.Router();

router.post('/add', isAdmin, addBlog);
router.get('/get-blogs', getBlogs);
router.get('/latest-blogs', getLatestBlogs);
router.delete('/delete/:blogId', isAdmin, deleteBlog);
router.get('/blog-detail/:blogId', singleBlog);
router.put('/update/:blogId',isAdmin, updateBlog);

export default router;