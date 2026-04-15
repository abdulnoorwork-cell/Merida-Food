import mysql from 'mysql';
import 'dotenv/config'

let pool;

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABAE,
        port: process.env.DB_PORT
    })
    console.log(`Connect to Database ${process.env.DB_DATABAE}`)
} catch (error) {
    console.log(error)
}

export default pool;