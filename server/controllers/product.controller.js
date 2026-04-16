import db from "../config/db.js";
import { v2 as cloudinary } from 'cloudinary'

export const addProduct = async (req, res) => {
    const { name, category, price, about, description, images } = req.body;
    if (!name || !category || !about || !description || !price || !images) {
        return res.status(400).json({ success: false, messege: "Please fill required fields" })
    }
    if (name.length > 120) {
        return res.status(401).json({ success: false, messege: "maximum name is 80 characters" })
    }
    if (name.length < 8) {
        return res.status(401).json({ success: false, messege: "name contains 8 characters atleast" })
    }
    if (Number(price) < 1) {
        return res.status(401).json({ success: false, messege: "price should br greater then 1" })
    }
    const sql = 'INSERT INTO products(`name`,`category`,`price`,`about`,`description`) VALUES(?)';
    const values = [
        name,
        category,
        price,
        about,
        description
    ];
    db.query(sql, [values], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Error in adding product: " + err })
        } else {
            const productId = result.insertId;
            const uploadImages = [];
            try {
                for (const img of images) {
                    const allowedFormat = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
                    if (!allowedFormat) {
                        return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg,png,jpeg,webp are allowed" })
                    }
                    const upload = await cloudinary.uploader.upload(img)
                    const productImages = {
                        public_id: upload.public_id,
                        url: upload.secure_url
                    }
                    uploadImages.push([productId, JSON.stringify(productImages)]);
                }
            } catch (error) {
                console.log(error)
                return res.json(error)
            }
            const imgSql = 'INSERT INTO product_images(`product_id`,`images`) VALUES ?';
            db.query(imgSql, [uploadImages], (err, result) => {
                if (err) return res.status(500).json({ success: false, messege: err })
                res.status(201).json({ success: true, messege: "Product added successfully" })
            })
        }
    })
}

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

export const getSingleProduct = (req, res) => {
    const { productId } = req.params;
    const sql = 'SELECT _id, name, category, price, about, description FROM products WHERE _id = ?';
    db.query(sql, [productId], async (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: 'Error in getting single product: ' + err });
        } else {
            if (data.length === 0) {
                return res.status(404).json({
                    success: false,
                    messege: "Product not found"
                });
            }
            const product = data[0]
            const imgSql = "SELECT images FROM product_images WHERE product_id = ?";
            db.query(imgSql, [productId], (err, imgData) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        messege: "Error fetching images"
                    });
                }
                product.images = imgData.map(img => JSON.parse(img.images))
                res.status(200).json(product);
            })
        }
    })
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        // 1️⃣ Get the images column from product_images table
        const [rows] = await new Promise((resolve, reject) => {
            db.query(
                'SELECT images FROM product_images WHERE product_id = ?',
                [productId],
                (err, results) => {
                    if (err) return reject(err);
                    resolve([results]);
                }
            );
        });

        // 2️⃣ Delete each image from Cloudinary
        for (const row of rows) {
            const images = JSON.parse(row.images); // parse JSON from column
            for (const img of images) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }
        }

        // 3️⃣ Delete image records from database
        await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM product_images WHERE product_id = ?',
                [productId],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        // 4️⃣ Delete product record
        await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM products WHERE _id = ?',
                [productId],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });

        res.status(200).json({ success: true, messege: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, messege: error.message });
    }
};

export const getSearchProducts = (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);

    let sql = ''; // ✅ FIXED

    if (query) {
        sql = `
      SELECT * FROM products 
      WHERE name LIKE ? 
      OR category LIKE ? 
      OR about LIKE ?
      OR description LIKE ?
    `;
    }

    const values = query
        ? [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
        : [];

    db.query(sql, values, async (err, data) => {
        if (err) return res.status(500).json(err);

        try {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql =
                        "SELECT images FROM product_images WHERE product_id = ?";

                    db.query(imgSql, [product._id], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                product.images = images.map((img) => JSON.parse(img.images));
            }

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    });
};

export const getSuggestions = (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    const sql = `SELECT _id, name
FROM products
WHERE name LIKE ? OR category LIKE ? LIMIT 8`
    const values = query ?
        [`%${query}%`, `%${query}%`] : [];
    db.query(sql, values, async (err, data) => {
        if (err) return res.status(500).json(err);
        try {
            for (let product of data) {
                const images = await new Promise((resolve, reject) => {
                    const imgSql =
                        "SELECT images FROM product_images WHERE product_id = ?";

                    db.query(imgSql, [product._id], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });

                product.images = images.map((img) => JSON.parse(img.images));
            }

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json(error);
        }
    });
};

export const getLatestProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const sql = 'SELECT _id, name, price, category, description, created_at FROM products ORDER BY created_at DESC LIMIT ?'
    db.query(sql, [limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ messege: err });
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
            res.status(200).json(data);
        }
    });
}

export const getCategoryProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const { category } = req.params;
    const sql = 'SELECT _id, name, category,price,description,created_at FROM products WHERE category = ? LIMIT ?'
    db.query(sql, [category, limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ messege: err });
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
            res.status(200).json(data);
        }
    });
}

export const getLatestCategoryProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const { category } = req.params;
    const sql = 'SELECT _id, name, category,price, description, created_at FROM products WHERE category = ? ORDER BY created_at DESC LIMIT ?'
    db.query(sql, [category, limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ messege: err });
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
            res.status(200).json(data);
        }
    });
}

export const getLimitProducts = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const sql = 'SELECT _id, name, price, category, description, created_at FROM products LIMIT ?'
    db.query(sql, [limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ messege: err });
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
            res.status(200).json(data);
        }
    });
}

export const getCategoryAllProducts = (req, res) => {
    const { category } = req.params;
    const sql = 'SELECT _id, name, category,price,description,created_at FROM products WHERE category = ?'
    db.query(sql, [category], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ messege: err });
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
            res.status(200).json(data);
        }
    });
}