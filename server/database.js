require('dotenv').config();
const mysql = require('mysql');

const config = {
  host: process.env.CLEARDB_HOST,
  user: process.env.CLEARDB_USER,
  password: process.env.CLEARDB_PASSWORD,
  database: process.env.CLEARDB_DB,
};

let dbconn;
let reconnected = false;

/**
 * Connects and reconnects on error.
 */
function connect() {
  dbconn = mysql.createConnection(config);

  dbconn.connect((err) => {
    if (err) return console.error(err);
    if (reconnected) return;
    reconnected = true;
    return console.log('database connected');
  });

  // Reconnect on connection lost from idle
  dbconn.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      throw err;
    }
  });
}

connect();

module.exports = dbconn;
