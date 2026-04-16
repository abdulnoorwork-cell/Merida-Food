import mysql from "mysql2";
import "dotenv/config";

let db;
try {
  db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // ✅ fixed
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log('Connected to Database: ' + process.env.DB_DATABASE)
} catch (error) {
  console.log(error)
}

export default db;