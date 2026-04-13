import jwt from 'jsonwebtoken';
import 'dotenv/config'

const generateToken = (id) => {
    const token = jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn: "1h"})
    return token;
}
export default generateToken;