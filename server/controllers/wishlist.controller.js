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

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                const [images] = await db.execute(
                    "SELECT image FROM product_images WHERE product_id = ?",
                    [product._id]
                );

                return {
                    ...product,
                    images: images.map(img => img.image)
                };
            })
        );

        res.status(200).json(updatedProducts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { user_id } = req.params;

        const sql = `
            SELECT 
                p._id,
                p.name,
                p.price,
                pi.images
            FROM wishlist w
            JOIN products p ON p._id = w.product_id
            LEFT JOIN product_images pi ON pi.product_id = p._id
            WHERE w.user_id = ?;
        `;

        const [data] = await db.query(sql, [user_id]);

        const map = {};

        data.forEach(row => {
            if (!map[row._id]) {
                map[row._id] = {
                    _id: row._id,
                    name: row.name,
                    price: row.price,
                    images: []
                };
            }

            if (row.images) {
                try {
                    const parsed = JSON.parse(row.images);
                    map[row._id].images.push(parsed.url);
                } catch (e) {
                    console.log("Invalid image JSON:", row.images);
                }
            }
        });

        return res.status(200).json(Object.values(map));

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
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