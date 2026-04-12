import { v2 as cloudinary } from 'cloudinary';
import db from '../config/db.js'

export const addBlog = async (req, res) => {
    const { title, description } = req.body;
    const { image } = req.files;
    if (!title || !description || !image) {
        return res.status(401).json({ success: false, messege: "All fields are required" })
    }
    if (title.length > 120) {
        return res.status(401).json({ success: false, messege: "maximum title is 120 characters" })
    }
    if (title.length < 12) {
        return res.status(401).json({ success: false, messege: "title contains 12 characters atleast" })
    }
    if (description.length < 256) {
        return res.status(401).json({ success: false, messege: "descrupition contains 256 characters atleast" })
    }
    const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedFormat.includes(image.mimetype)) {
        return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg, jpeg, png, webp are allowed" });
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, { folder: "blogs" })
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log(cloudinaryResponse.error)
    }
    const imageData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
    }
    const sql = 'INSERT INTO blogs(`title`,`description`,`image`) VALUES(?)';
    const values = [
        title,
        description,
        JSON.stringify(imageData)
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in adding blog: " + err });
        } else {
            res.status(201).json({ success: true, messege: "Blog added successfully", data })
        }
    })
}

export const getBlogs = (req, res) => {
    const sql = 'SELECT _id, title, description, image, created_at FROM blogs';
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in getting blogs: " + err });
        } else {
            res.status(200).json(data);
        }
    })
}

export const singleBlog = async (req, res) => {
    const { blogId } = req.params;
    const sql = 'SELECT _id, title, description, image, created_at FROM blogs WHERE _id = ?'
    db.query(sql, blogId, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in getting blog: " + err });
        } else {
            res.status(200).json(data);
        }
    })
}

export const deleteBlog = (req, res) => {
    const { blogId } = req.params;
    const sql = 'DELETE FROM blogs WHERE _id = ?';
    db.query(sql, blogId, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, messege: "Error in deleting blog: " + err });
        } else {
            res.status(200).json({ success: true, messege: "Blog deleted successfully" });
        }
    })
}

export const updateBlog = async (req, res) => {
    if (req.body.image !== '') {
        const { title, description } = req.body;
        const { image } = req.files;
        if (!title || !description || !image) {
            return res.status(401).json({ success: false, messege: "All fields are required" })
        }
        if (title.length > 120) {
            return res.status(401).json({ success: false, messege: "maximum title is 120 characters" })
        }
        if (title.length < 12) {
            return res.status(401).json({ success: false, messege: "title contains 12 characters atleast" })
        }
        if (description.length < 256) {
            return res.status(401).json({ success: false, messege: "description contains 256 characters atleast" })
        }
        const { blogId } = req.params;
        const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ success: false, messege: "Invalid Format! Only jpg, jpeg, png, webp are allowed" });
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, {
            overwrite: true
        })
        const imageData = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.url,
        }
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            return console.log(cloudinaryResponse.error)
        }
        const sql = 'UPDATE blogs SET title = ?, description = ?, image = ? WHERE _id = ?';
        const values = [
            title,
            description,
            JSON.stringify(imageData)
        ];
        db.query(sql, [...values, blogId], (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ success: false, messege: "Error in updating blog: " + err });
            } else {
                res.status(200).json({ success: true, messege: "Blog updated successfully", data })
            }
        })
        return
    }
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(401).json({ success: false, messege: "All fields are required" })
    }
    if (title.length > 120) {
        return res.status(401).json({ success: false, messege: "maximum title is 120 characters" })
    }
    if (title.length < 12) {
        return res.status(401).json({ success: false, messege: "title contains 12 characters atleast" })
    }
    if (description.length < 256) {
        return res.status(401).json({ success: false, messege: "descrupition contains 256 characters atleast" })
    }
    const { blogId } = req.params;
    const sql = 'UPDATE blogs SET title = ?, description = ? WHERE _id = ?';
    const values = [
        title,
        description
    ];
    db.query(sql, [...values, blogId], (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ success: false, messege: "Error in updating blog: " + err });
        } else {
            res.status(200).json({ success: true, messege: "Blog updated successfully", data })
        }
    })
}

export const getLatestBlogs = (req, res) => {
    const limit = parseInt(req.query.limit) || 4;
    const sql = 'SELECT _id, title, description, image, created_at FROM blogs ORDER BY created_at DESC LIMIT ?'
    db.query(sql, [limit], async (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        } else {
            res.status(200).json(data);
        }
    });
}

export const getSearchBlogs = (req, res) => {
    const { blogQuery } = req.query;
    if (!blogQuery) return res.json([]);

    let sql = ''; // ✅ FIXED

    if (blogQuery) {
        sql = `
      SELECT * FROM blogs 
      WHERE title LIKE ? 
      OR description LIKE ?
    `;
    }

    const values = blogQuery
        ? [`%${blogQuery}%`, `%${blogQuery}%`]
        : [];

    db.query(sql, values, async (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
};

export const getBlogSuggestions = (req, res) => {
    const { blogQuery } = req.query;
    if (!blogQuery) return res.json([]);
    const sql = `SELECT _id, title, image
FROM blogs
WHERE title LIKE ? OR description LIKE ? LIMIT 8`
    const values = blogQuery ?
        [`%${blogQuery}%`, `%${blogQuery}%`] : [];
    db.query(sql, values, async (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
};