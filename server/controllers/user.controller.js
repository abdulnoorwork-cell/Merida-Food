import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt'
import db from '../config/db.js'
import generateToken from '../config/token.js';
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const profileImage = req.files?.profile_image;

        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill required fileds"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // 2. Check if email exists
        const [existingUser] = await db.query(
            "SELECT _id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 3. Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        let imageData = null;

        // 4. If image uploaded
        if (profileImage) {
            const allowedFormat = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

            if (!allowedFormat.includes(profileImage.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid image format"
                });
            }

            const upload = await cloudinary.uploader.upload(profileImage.tempFilePath, {
                folder: "users"
            });

            imageData = JSON.stringify({
                url: upload.secure_url,
                public_id: upload.public_id
            });
        }

        // 5. Insert user
        await db.query(
            "INSERT INTO users (name, email, password, phone, profile_image) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashPassword, phone || null, imageData]
        );

        res.status(201).json({
            success: true,
            message: "Signup successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 1. Find user
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (!users.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Generate token
        const token = generateToken(user._id);

        // 4. Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        // 5. Remove password before sending
        delete user.password;

        res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            user,
            token,
            expiresIn: 86400
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const sql = 'SELECT * FROM users WHERE _id = ?';
        const [data] = await db.query(sql, [user_id]);

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: "Error in getting user: " + err.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { user_id } = req.params;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                messege: "Please fill required fields"
            });
        }

        let imgUrl = null;

        // ✅ If image exists
        if (req.files && req.files.profile_image) {
            const { profile_image } = req.files;

            const allowedFormat = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

            if (!allowedFormat.includes(profile_image.mimetype)) {
                return res.status(400).json({
                    success: false,
                    messege: "Invalid Format! Only jpg, jpeg, png, webp are allowed"
                });
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(
                profile_image.tempFilePath,
                { overwrite: true }
            );

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                return res.status(500).json({
                    success: false,
                    messege: "Image upload failed"
                });
            }

            imgUrl = cloudinaryResponse.url;
        }

        // ✅ Build query dynamically
        let sql;
        let values;

        if (imgUrl) {
            sql = 'UPDATE users SET name = ?, email = ?, phone = ?, profile_image = ? WHERE _id = ?';
            values = [name, email, phone, imgUrl, user_id];
        } else {
            sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE _id = ?';
            values = [name, email, phone, user_id];
        }

        await db.query(sql, values);

        return res.status(200).json({
            success: true,
            messege: "Profile updated"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: "Error in updating user: " + err.message
        });
    }
};

export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ success: false, messege: "Can,t be empty" })
        }
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, messege: "Invalid Credientials" })
        }
        const token = jwt.sign(email + password, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({ success: true, messege: "admin loggedin successfull", token })
    } catch (error) {
        return res.status(500).json({ success: false, messege: "Error in Login: " + error })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                messege: "Email is required"
            });
        }

        const sql = 'SELECT * FROM users WHERE email = ?';
        const [data] = await db.query(sql, [email]);

        if (!data.length) {
            return res.status(404).json({
                success: false,
                messege: "User not found"
            });
        }

        const user = data[0];

        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.RESET_TOKEN,
            { expiresIn: '10m' }
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Reset Password',
            text: `Click the link to reset your password: ${resetLink}`
        };

        // ✅ Proper await (NO callback)
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            messege: "Reset password link sent successfully",
            resetLink // remove this in production
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: "Error: " + err.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                messege: "Token and password are required"
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.RESET_TOKEN);
        } catch (err) {
            return res.status(400).json({
                success: false,
                messege: "Invalid or expired token"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const sql = 'UPDATE users SET password = ? WHERE _id = ?';
        await db.query(sql, [hashPassword, decoded.id]);

        return res.status(200).json({
            success: true,
            messege: "Password reset successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            messege: "Error in reset password: " + err.message
        });
    }
};