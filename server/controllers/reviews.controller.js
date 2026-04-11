import db from '../config/db.js'
import { v2 as cloudinary } from 'cloudinary'

export const addReview = async (req, res) => {
    const { product_id, user_id, rating, comment } = req.body;
    if (!rating) {
        return res.status(400).json({ success: false, message: "Rating can,t be null!" })
    }
    if (!comment) {
        return res.status(400).json({ success: false, message: "Comment can,t be null!" })
    }
    const images = Array.isArray(req.body.images) ? req.body.images : [];
    let uploadedUrls = [];
    const allowedFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
    if (!allowedFormat) {
        return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg,png,jpeg,webp are allowed" })
    }
    try {
        for (const img of images) {
            const cloudinaryResponse = await cloudinary.uploader.upload(img, { folder: "reviews" });
            uploadedUrls.push(cloudinaryResponse.secure_url);
        }
    } catch (error) {
        console.log(error)
        return res.json(error)
    }
    // 1️⃣ Check if user purchased & received product
    const checkSql = `SELECT orders._id FROM orders JOIN order_items ON orders._id = order_items.order_id WHERE orders.user_id = ? AND order_items.product_id = ? AND orders.order_status = "DELIVERED" LIMIT 1`;
    db.query(checkSql, [user_id, product_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, messege: err });
        }
        if (!result || result.length === 0) {
            return res.status(403).json({ success: false, messege: "You can only review products you have purchased and received." });
        }
        // 2️⃣ Prevent duplicate review
        const duplicateSql = `SELECT * FROM reviews WHERE user_id = ? AND product_id = ?`;
        db.query(duplicateSql, [user_id, product_id], (err, existing) => {
            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    messege: "You already reviewed this product."
                });
            }
            // 3️⃣ Insert Review
            const insertSql = `INSERT INTO reviews (product_id, user_id, rating, comment, images) VALUES(?, ?, ?, ?, ?)`;
            db.query(insertSql, [product_id, user_id, rating, comment, JSON.stringify(uploadedUrls)], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err });
                }
                res.json({
                    success: true,
                    messege: "Review added successfully!"
                });
            })
        })
    })
}

export const getProductReviews = (req, res) => {
    const { product_id } = req.params;
    const sql = `SELECT 
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
ORDER BY reviews.created_at DESC`;
    db.query(sql, [product_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: err });
        }
        res.json(data);
    })
}

export const productRating = async (req, res) => {
    const { product_id } = req.params;
    const sql = `SELECT 
            AVG(rating) AS average_rating,
            COUNT(*) AS total_reviews
        FROM reviews
        WHERE product_id = ?`
    db.query(sql, [product_id], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: err });
        }
        res.json(data);
    })
}

export const getAllReviews = (req, res) => {
    const sql = "SELECT reviews._id, reviews.product_id, reviews.comment, reviews.rating, reviews.created_at, users.name, users.email, users.profile_image, products.name AS product_name, products.price FROM reviews JOIN users ON users._id = reviews.user_id JOIN products ON products._id = reviews.product_id";
    db.query(sql, async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: err });
        } else {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql = "SELECT images FROM product_images WHERE product_id = ?";
                    db.query(imgSql, [product.product_id], (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    })
                })
                product.images = images.map(img => JSON.parse(img.images))
            }
            res.status(200).json(data)
        }
    })
}

export const getSingleReview = (req, res) => {
    const { id } = req.params;
    const sql = `SELECT reviews._id, reviews.comment, users.name, users.email, users.profile_image FROM reviews JOIN users ON users._id = reviews.user_id WHERE reviews._id = ?`
    db.query(sql, [id], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: err });
        } else {
            res.status(200).json(data)
        }
    })
}

export const adminReply = (req, res) => {
    const { review_id, reply } = req.body;
    if (!review_id) {
        return res.status(400).json({ success: false, messege: "Invalid review ID" })
    }
    if (!reply) {
        return res.status(400).json({ success: false, messege: "Reply comment can,t be null!" })
    }
    const sql = `INSERT INTO reviews_replies (review_id, reply) VALUES (?,?)`;
    db.query(sql, [review_id, reply], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: err });
        } else {
            res.status(201).json({ success: true, messege: "Reply added successfully" })
        }
    })
}