require('dotenv').config();
const mysql = require('mysql');

const config = {
  host: process.env.CLEARDB_HOST,
  user: process.env.CLEARDB_USER,
  password: process.env.CLEARDB_PASSWORD,
  database: process.env.CLEARDB_DB,
};

let dbconn;

/**
 * Connects and reconnects on error.
 */
function handleDisconnect() {
  dbconn = mysql.createConnection(config);

  dbconn.connect((err) => {
    if (err) return console.error(err);
    return console.log('database connected');
    // return console.log(`connected to ${config.database} : ${config.user}@${config.host}`);
  });

  // Reconnect on connection lost from idle
  dbconn.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = dbconn;
