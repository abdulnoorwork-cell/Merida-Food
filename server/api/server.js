import express from 'express'
import 'dotenv/config'
import '../config/db.js'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import userRoutes from '../routes/user.routes.js'
import blogRoutes from '../routes/blog.routes.js'
import productRoutes from '../routes/product.routes.js'
import cartRoutes from '../routes/cart.routes.js'
import orderRoutes from '../routes/order.routes.js'
import wishlistRoutes from '../routes/wishlist.routes.js'
import reviewRoutes from '../routes/review.routes.js'
import Stripe from 'stripe';
import db from '../config/db.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express();
const Port = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ limit: "50mb",extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  limits:{fileSize:50*1024*1024}
}))
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get('/', (_, res) => {
  res.status(200).json({ success: true, messege: "Response from the server" })
})
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/review', reviewRoutes);

// app.listen(Port, () => {
//   console.log(`Server is running http://localhost:${Port}`)
// })

export default app