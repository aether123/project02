const mysql = require("mysql2");
//npm install --save mysql2
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "user",
});

module.exports = connection;
