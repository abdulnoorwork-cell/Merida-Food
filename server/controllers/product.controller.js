import db from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary'

export const addProduct = async (req, res) => {
    try {
        const { name, category, price, about, description, images } = req.body;

        if (!name || !category || !about || !description || !price || !images) {
            return res.status(400).json({
                success: false,
                message: "Please fill required fields"
            });
        }

        if (name.length > 120 || name.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 8-120 characters"
            });
        }

        if (Number(price) < 1) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 1"
            });
        }

        // 1. Insert product
        const [result] = await db.query(
            "INSERT INTO products (name, category, price, about, description) VALUES (?, ?, ?, ?, ?)",
            [name, category, price, about, description]
        );

        const productId = result.insertId;

        // 2. Upload images
        const uploadImages = [];

        const allowedFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];

        for (const img of images) {
            const upload = await cloudinary.uploader.upload(img);

            uploadImages.push([
                productId,
                JSON.stringify({
                    public_id: upload.public_id,
                    url: upload.secure_url
                })
            ]);
        }

        // 3. Insert images (bulk)
        await db.query(
            "INSERT INTO product_images (product_id, images) VALUES ?",
            [uploadImages]
        );

        res.status(201).json({
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        // 1. Get all products
        const [products] = await db.query(
            "SELECT _id, name, price, category, description, created_at FROM products"
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

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
    } catch (error) {
        console.error("Get Products Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const [productRows] = await db.query(
            "SELECT _id, name, category, price, about, description FROM products WHERE _id = ?",
            [productId]
        );

        if (!productRows.length) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const product = productRows[0];

        const [imgRows] = await db.query(
            "SELECT images FROM product_images WHERE product_id = ?",
            [productId]
        );

        product.images = imgRows.map(img => {
            try {
                return JSON.parse(img.images);
            } catch {
                return img.images;
            }
        });

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const [imgRows] = await db.query(
            "SELECT images FROM product_images WHERE product_id = ?",
            [productId]
        );

        for (const row of imgRows) {
            const images = JSON.parse(row.images);

            if (images.public_id) {
                await cloudinary.uploader.destroy(images.public_id);
            }
        }

        await db.query("DELETE FROM product_images WHERE product_id = ?", [productId]);
        await db.query("DELETE FROM products WHERE _id = ?", [productId]);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSearchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(200).json([]);
        }

        // 1. Search products
        const [products] = await db.query(
            `SELECT _id, name, category, price, about, description, created_at 
       FROM products 
       WHERE name LIKE ? 
       OR category LIKE ? 
       OR about LIKE ? 
       OR description LIKE ?`,
            [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images for these products
        const ids = products.map(p => p._id);

        const [images] = await db.query(
            "SELECT product_id, images FROM product_images WHERE product_id IN (?)",
            [ids]
        );

        // 3. Group images
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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(200).json([]);
        }

        // 1. Get suggestions
        const [products] = await db.query(
            `SELECT _id, name 
       FROM products 
       WHERE name LIKE ? OR category LIKE ? 
       LIMIT 8`,
            [`%${query}%`, `%${query}%`]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images
        const ids = products.map(p => p._id);

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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getLatestProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;

        // 1. Get latest products
        const [products] = await db.query(
            "SELECT _id, name, price, category, description, created_at FROM products ORDER BY created_at DESC LIMIT ?",
            [limit]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get all images in ONE query
        const [images] = await db.query(
            "SELECT product_id, images FROM product_images"
        );

        // 3. Group images
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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getCategoryProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const { category } = req.params;

        // 1. Get products by category
        const [products] = await db.query(
            "SELECT _id, name, category, price, description, created_at FROM products WHERE category = ? LIMIT ?",
            [category, limit]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images only for these products
        const ids = products.map(p => p._id);

        const [images] = await db.query(
            "SELECT product_id, images FROM product_images WHERE product_id IN (?)",
            [ids]
        );

        // 3. Group images
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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getLatestCategoryProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const { category } = req.params;

        // 1. Get latest category products
        const [products] = await db.query(
            "SELECT _id, name, category, price, description, created_at FROM products WHERE category = ? ORDER BY created_at DESC LIMIT ?",
            [category, limit]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images only for these products
        const ids = products.map(p => p._id);

        const [images] = await db.query(
            "SELECT product_id, images FROM product_images WHERE product_id IN (?)",
            [ids]
        );

        // 3. Group images
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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getLimitProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;

        // 1. Get products
        const [products] = await db.query(
            "SELECT _id, name, price, category, description, created_at FROM products LIMIT ?",
            [limit]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images for these products only
        const ids = products.map(p => p._id);

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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getCategoryAllProducts = async (req, res) => {
    try {
        const { category } = req.params;

        // 1. Get category products
        const [products] = await db.query(
            "SELECT _id, name, category, price, description, created_at FROM products WHERE category = ?",
            [category]
        );

        if (!products.length) {
            return res.status(200).json([]);
        }

        // 2. Get images for these products
        const ids = products.map(p => p._id);

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
        const result = products.map(product => ({
            ...product,
            images: imageMap[product._id] || []
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};