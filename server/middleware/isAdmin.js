import jwt from 'jsonwebtoken';
import 'dotenv/config'
const isAdmin = (req, res,next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({ success: false, messege: "Not authorized" })
        }
        const decoded = jwt.verify(token,process.env.ADMIN_JWT_SECRET);
        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(400).json({ success: false, messege: "invalid credentials" })
        }
        next();
    } catch (error) {
        return res.status(500).json({success: false, messege: "invalid token: " + error})
    }
}

export default isAdmin;