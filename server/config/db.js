import mysql from 'mysql';
import 'dotenv/config'

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABAE,
    port: process.env.DB_PORT
});

db.connect((err)=>{
    if(err)return console.log(err)
    console.log("Connected to Database: " + process.env.DB_DATABAE)
})

export default db;