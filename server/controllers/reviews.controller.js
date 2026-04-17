import db from '../config/db.js'
import { v2 as cloudinary } from 'cloudinary'

export const addReview = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: "Rating can't be null!" });
    }

    if (!comment) {
      return res.status(400).json({ success: false, message: "Comment can't be null!" });
    }

    let uploadedUrls = [];

    // ✅ Handle files correctly
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      const allowedFormat = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

      for (const file of files) {
        if (!allowedFormat.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            messege: "Invalid format! Only jpg, jpeg, png, webp allowed"
          });
        }

        const response = await cloudinary.uploader.upload(
          file.tempFilePath, // ✅ FIX HERE
          { folder: "reviews" }
        );

        uploadedUrls.push(response.secure_url);
      }
    }

    // ✅ Check purchase
    const checkSql = `
      SELECT orders._id 
      FROM orders 
      JOIN order_items ON orders._id = order_items.order_id 
      WHERE orders.user_id = ? 
      AND order_items.product_id = ? 
      AND orders.order_status = "DELIVERED"
      LIMIT 1
    `;
    const [purchased] = await db.query(checkSql, [user_id, product_id]);

    if (!purchased.length) {
      return res.status(403).json({
        success: false,
        messege: "You can only review purchased products."
      });
    }

    // ✅ Prevent duplicate
    const [existing] = await db.query(
      `SELECT _id FROM reviews WHERE user_id = ? AND product_id = ?`,
      [user_id, product_id]
    );

    if (existing.length) {
      return res.status(400).json({
        success: false,
        messege: "You already reviewed this product."
      });
    }

    // ✅ Insert
    await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment, images)
       VALUES (?, ?, ?, ?, ?)`,
      [product_id, user_id, rating, comment, JSON.stringify(uploadedUrls)]
    );

    return res.json({
      success: true,
      messege: "Review added successfully!"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      messege: err.message
    });
  }
};

export const getProductReviews = async (req, res) => {
    try {
        const { product_id } = req.params;

        const sql = `
      SELECT 
        reviews.*,
        users.name,
        users.email,
        users.profile_image,
        reviews_replies.reply,
        reviews_replies.created_at AS reply_created_at
      FROM reviews
      JOIN users ON reviews.user_id = users._id
      LEFT JOIN reviews_replies ON reviews._id = reviews_replies.review_id
      WHERE reviews.product_id = ?
      ORDER BY reviews.created_at DESC
    `;

        const [data] = await db.query(sql, [product_id]);

        // ✅ Parse review images
        const result = data.map(r => ({
            ...r,
            images: r.images ? JSON.parse(r.images) : []
        }));

        return res.json(result);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const productRating = async (req, res) => {
    try {
        const { product_id } = req.params;

        const sql = `
      SELECT 
        AVG(rating) AS average_rating,
        COUNT(*) AS total_reviews
      FROM reviews
      WHERE product_id = ?
    `;

        const [data] = await db.query(sql, [product_id]);

        return res.json(data[0]);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const sql = `
      SELECT 
        r._id,
        r.product_id,
        r.comment,
        r.rating,
        r.created_at,
        r.images,
        u.name,
        u.email,
        u.profile_image,
        p.name AS product_name,
        p.price
      FROM reviews r
      JOIN users u ON u._id = r.user_id
      JOIN products p ON p._id = r.product_id
    `;

        const [data] = await db.query(sql);

        const result = data.map(r => ({
            ...r,
            images: r.images ? JSON.parse(r.images) : []
        }));

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getSingleReview = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
      SELECT 
        reviews._id,
        reviews.comment,
        reviews.images,
        users.name,
        users.email,
        users.profile_image
      FROM reviews
      JOIN users ON users._id = reviews.user_id
      WHERE reviews._id = ?
    `;

        const [data] = await db.query(sql, [id]);

        if (!data.length) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        const review = {
            ...data[0],
            images: data[0].images ? JSON.parse(data[0].images) : []
        };

        return res.status(200).json(review);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const adminReply = async (req, res) => {
  try {
    const { review_id, reply } = req.body;

    if (!review_id) {
      return res.status(400).json({ success: false, messege: "Invalid review ID" });
    }

    if (!reply) {
      return res.status(400).json({ success: false, messege: "Reply can't be empty!" });
    }

    const sql = `INSERT INTO reviews_replies (review_id, reply) VALUES (?, ?)`;

    await db.query(sql, [review_id, reply]);

    return res.status(201).json({
      success: true,
      messege: "Reply added successfully"
    });

  } catch (err) {
    return res.status(500).json({ success: false, messege: err.message });
  }
};