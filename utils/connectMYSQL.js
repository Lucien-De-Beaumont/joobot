const mysql = require("mysql2/promise");

const db = mysql.createPool({
    connectionLimit: 10,
    host: "remotemysql.com",
    user: "4eRw88wdtt",
    password: "IIq4Rwgh38",
    database: "4eRw88wdtt",
    charset: "utf8mb4",
});

module.exports = db;