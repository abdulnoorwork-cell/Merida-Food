import db from '../config/db.js'

export const addToCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { product_id, quantity = 1 } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product id required"
            });
        }

        await db.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [user_id, product_id, quantity]
        );

        res.status(201).json({
            success: true,
            message: "Added to cart"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart"
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        // 1. Get cart items
        const [cartItems] = await db.query(
            `SELECT 
        cart_items._id AS cart_id,
        products._id,
        products.name,
        products.price,
        cart_items.quantity,
        (products.price * cart_items.quantity) AS total
       FROM cart_items
       JOIN products ON cart_items.product_id = products._id
       WHERE cart_items.user_id = ?`,
            [user_id]
        );

        if (!cartItems.length) {
            return res.status(200).json([]);
        }

        // 2. Get images (NO loop queries)
        const ids = cartItems.map(item => item._id);

        const [images] = await db.query(
            "SELECT product_id, images FROM product_images WHERE product_id IN (?)",
            [ids]
        );

        // 3. Map images
        const imageMap = {};

        for (const img of images) {
            if (!imageMap[img.product_id]) {
                imageMap[img.product_id] = [];
            }

            try {
                imageMap[img.product_id].push(JSON.parse(img.images));
            } catch {
                imageMap[img.product_id].push(img.images);
            }
        }

        // 4. Attach images
        const result = cartItems.map(item => ({
            ...item,
            images: imageMap[item._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching cart"
        });
    }
};

export const totalItems = async (req, res) => {
    try {
        const { user_id } = req.params;

        const [[result]] = await db.query(
            "SELECT SUM(quantity) AS total_items FROM cart_items WHERE user_id = ?",
            [user_id]
        );

        res.status(200).json({
            total_items: result.total_items || 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error getting total items"
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { cart_id } = req.body;

        if (!cart_id) {
            return res.status(400).json({
                success: false,
                message: "Cart id required"
            });
        }

        await db.query(
            "DELETE FROM cart_items WHERE user_id = ? AND _id = ?",
            [user_id, cart_id]
        );

        res.status(200).json({
            success: true,
            message: "Product removed"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error removing item"
        });
    }
};

export const quantityUpdated = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { cart_id, quantity } = req.body;

        if (!cart_id) {
            return res.status(400).json({
                success: false,
                message: "Cart id required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        await db.query(
            "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND _id = ?",
            [quantity, user_id, cart_id]
        );

        res.status(200).json({
            success: true,
            message: "Quantity updated"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating quantity"
        });
    }
};