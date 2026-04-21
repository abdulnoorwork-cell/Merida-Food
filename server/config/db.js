import mysql from "mysql2/promise";
import "dotenv/config";

let db;

if (!global.dbPool) {
  global.dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 1,   // keep small
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  console.log("✅ MySQL Pool Ready");
}

db = global.dbPool;

export default db;