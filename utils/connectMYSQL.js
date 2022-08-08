const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    port: "3306",
    user: "id19387237_admin",
    password: "12345678910aA!",
    database: "id19387237_heroicacademy",
    charset: "utf8mb4",
});

module.exports = db;