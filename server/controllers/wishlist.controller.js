import db from '../config/db.js'
export const addToWishlist = (req, res) => {
    const { user_id, product_id } = req.body;
    const sql = "INSERT INTO wishlist (user_id, product_id) VALUES(?,?)";
    db.query(sql, [user_id, product_id], (err, result) => {
        if (err) {
            console.log(err)
            if (err.code === "ER_DUP_ENTRY") {
                console.log(err)
                return res.json({ message: "Already in wishlist" });
            }
            return res.status(500).json(err);
        }
        res.status(201).json({ success: true, messege: "Added to wishlist" });
    })
}

export const removeFromWishlist = (req, res) => {
    const { user_id, product_id } = req.body;
    const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
    db.query(sql, [user_id, product_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, messege: "Removed from wishlist" });
    })
}

export const getWishlist = (req, res) => {
    const { user_id } = req.params;
    const sql = "SELECT products.* FROM wishlist JOIN products ON products._id = wishlist.product_id WHERE wishlist.user_id = ?";
    db.query(sql, [user_id], async (err, data) => {
        if (err) return res.status(500).json(err);
        for (let product of data) {
            const images = await new Promise((resolve, reject) => {
                const imgSql = "SELECT images FROM product_images WHERE product_id = ?";
                db.query(imgSql, [product._id], (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })
            product.images = images.map(img => JSON.parse(img.images))
        }
        res.status(200).json(data);
    })
}

export const getWishlistProducts = (req, res) => {
    const sql = `SELECT 
  p._id,
  p.name,
  p.category,
  p.price,
  COUNT(w.product_id) AS total_wishes
FROM wishlist w
JOIN products p ON p._id = w.product_id
GROUP BY p._id
ORDER BY total_wishes DESC`;
    db.query(sql, async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        } else {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql = "SELECT images FROM product_images WHERE product_id = ?";
                    db.query(imgSql, [product._id], (err, data) => {
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

export const removeWishlistProduct = (req, res) => {
    const { product_id } = req.params;
    const sql = 'DELETE FROM wishlist WHERE product_id = ?'
    db.query(sql, [product_id], (err, result) => {
        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "No product found with this ID" });
        }
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Server error" });
        } else {
            res.json({ success: true, messege: "Product removed from wishlist" })
        }
    })
}