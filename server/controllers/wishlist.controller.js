import db from '../config/db.js'

export const addToWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        const sql = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";
        await db.query(sql, [user_id, product_id]);

        return res.status(201).json({
            success: true,
            messege: "Added to wishlist"
        });

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.json({ message: "Already in wishlist" });
        }

        return res.status(500).json({
            success: false,
            messege: err.message
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        const sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
        await db.query(sql, [user_id, product_id]);

        return res.json({
            success: true,
            messege: "Removed from wishlist"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: err.message
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { user_id } = req.params;

        const sql = `
      SELECT 
        p.*,
        GROUP_CONCAT(pi.images) AS images
      FROM wishlist w
      JOIN products p ON p._id = w.product_id
      LEFT JOIN product_images pi ON pi.product_id = p._id
      WHERE w.user_id = ?
      GROUP BY p._id
    `;

        const [data] = await db.query(sql, [user_id]);

        // ✅ Parse images
        const result = data.map(product => ({
            ...product,
            images: product.images
                ? product.images.split(",").map(img => JSON.parse(img))
                : []
        }));

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: err.message
        });
    }
};

export const getWishlistProducts = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p._id,
        p.name,
        p.category,
        p.price,
        COUNT(w.product_id) AS total_wishes,
        CONCAT('[', GROUP_CONCAT(pi.images), ']') AS images
      FROM wishlist w
      JOIN products p ON p._id = w.product_id
      LEFT JOIN product_images pi ON pi.product_id = p._id
      GROUP BY p._id
      ORDER BY total_wishes DESC
    `;

    const [data] = await db.query(sql);

    const result = data.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      success: false,
      messege: err.message
    });
  }
};

export const removeWishlistProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        const sql = "DELETE FROM wishlist WHERE product_id = ?";
        const [result] = await db.query(sql, [product_id]);

        if (result.affectedRows === 0) {
            return res.json({
                success: false,
                messege: "No product found with this ID"
            });
        }

        return res.json({
            success: true,
            messege: "Product removed from wishlist"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: err.message
        });
    }
};