import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({ success: false, messege: "Not authorized" })
        }
        const decode =jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = decode.id;
        next();
    } catch (error) {
        return res.status(500).json({ messege: "internal server error in authentication: " + error });
    }
}