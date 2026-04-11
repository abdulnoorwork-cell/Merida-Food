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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import db from '../config/db.js';

const app = express();
const Port = process.env.PORT || 8000;

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔥 Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const user_id = session.metadata.user_id;
    const address = JSON.parse(session.metadata.address);
    const total_amount = session.metadata.total_amount;

    console.log("User:", user_id);

    try {
      // ✅ 1. Get cart items from DB
      db.query(
        "SELECT * FROM cart_items WHERE user_id = ?",
        [user_id],
        (err, items) => {
          if (err) {
            console.log("❌ Cart fetch error:", err);
            return;
          }

          console.log("Cart Items:", items);

          if (!items || items.length === 0) {
            console.log("⚠️ Cart is empty, nothing to insert");
            return;
          }

          // ✅ 2. Create order
          db.query(
            `INSERT INTO orders (user_id, total_amount, payment_method, address, payment_status)
             VALUES (?, ?, ?, ?, ?)`,
            [user_id, total_amount, "ONLINE", JSON.stringify(address), "PAID"],
            (err, result) => {
              if (err) {
                console.log("❌ Order insert error:", err);
                return;
              }

              const order_id = result.insertId;

              // ✅ 3. Insert items
              items.forEach(item => {
                db.query(
                  `INSERT INTO order_items (order_id, product_id, quantity, price)
                   VALUES (?, ?, ?, ?)`,
                  [order_id, item.product_id, item.quantity, item.price],
                  (err) => {
                    if (err) console.log("❌ Item insert error:", err);
                  }
                );
              });

              // ✅ 4. Clear cart
              db.query(
                "DELETE FROM cart_items WHERE user_id = ?",
                [user_id],
                (err) => {
                  if (err) console.log("❌ Cart delete error:", err);
                }
              );

              console.log("✅ Order created:", order_id);
            }
          );
        }
      );
    } catch (err) {
      console.log("❌ Webhook error:", err);
    }
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}))
app.use(cookieParser());

const allowedOrigin = [
  process.env.FRONTEND_URL
]

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by cors policy"))
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true
}
app.use(cors(corsOptions));

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