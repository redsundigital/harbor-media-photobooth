require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.CLEARDB_HOST,
  user: process.env.CLEARDB_USER,
  password: process.env.CLEARDB_PASSWORD,
  database: process.env.CLEARDB_DB
});

connection.connect(err => {
  if (err) {
    console.log('mysql connect error', err);
  } else {
    console.log('mysql connected');
  }
});

module.exports = connection;
