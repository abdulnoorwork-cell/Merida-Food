import mysql from 'mysql';
import 'dotenv/config'

let db;

try {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABAE,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    console.log(`Connect to Database ${process.env.DB_DATABAE}`)
} catch (error) {
    console.log(error)
}

export default db;