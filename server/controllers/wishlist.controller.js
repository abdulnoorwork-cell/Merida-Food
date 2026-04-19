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

export const getWishlist = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [products] = await db.execute(
            `SELECT p.* 
             FROM wishlist w 
             JOIN products p ON p._id = w.product_id 
             WHERE w.user_id = ?`,
            [user_id]
        );

        // 2. Get all images in ONE query (NO LOOP QUERIES)
        const [images] = await db.query(
            "SELECT product_id, images FROM product_images"
        );

        // 3. Group images by product_id
        const imageMap = {};

        for (const img of images) {
            if (!imageMap[img.product_id]) {
                imageMap[img.product_id] = [];
            }

            try {
                imageMap[img.product_id].push(JSON.parse(img.images));
            } catch (e) {
                imageMap[img.product_id].push(img.images);
            }
        }

        // 4. Attach images to products
        const result = products.map((product) => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        await db.execute(
            "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?",
            [user_id, product_id]
        );

        res.json({ success: true, message: "Removed from wishlist" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
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