const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: process.env.db_host,
  database: process.env.db_name,
  user: process.env.db_user,
  password: process.env.db_pass,
});

connection.connect((err) => {
  err
    ? console.warn("You could not connect to the database.", {
        Error: err.message,
      })
    : console.log("Connection established successfully.");
});

connection.query = util.promisify(connection.query);

module.exports = connection;
