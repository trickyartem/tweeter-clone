import mysql  from "mysql";
import dotEnv from "dotenv";

dotEnv.config();
export default mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

