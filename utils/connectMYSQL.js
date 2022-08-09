const mysql = require("mysql");

const db = mysql.createPool({
    connectionLimit: 10,
    host: "145.14.145.102",
    user: "id19387237_admin",
    password: "12345678910aA!",
    database: "id19387237_heroicacademy",
    charset: "utf8mb4",
});

module.exports = db;