import mysql from "mysql";
import "dotenv/config";

let db;

if (!global.dbPool) {
  global.dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // ✅ fixed
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log("✅ Database Pool Created");
}

db = global.dbPool;

export default db;