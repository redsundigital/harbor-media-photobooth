require('dotenv').config();
const express = require('express');
const path = require('path');
const utils = require('./utils/utils.js');
const mailer = require('./utils/mailer.js');

/* Files */

const buildDir = path.join(__dirname, 'client');
const indexHtml = path.join(buildDir, 'index.html');

/* Database */

// Database config
const dbconfig = {
  host: process.env.CLEARDB_HOST,
  user: process.env.CLEARDB_USER,
  password: process.env.CLEARDB_PASSWORD,
  database: process.env.CLEARDB_DB,
};

// Database connection
let db;

function handleDisconnect() {
  db = mysql.createConnection(dbconfig);

  db.connect((err) => {
    if (err) return console.error(err);
    return console.log(`connected to ${dbconfig.database} : ${dbconfig.user}@${dbconfig.host}`);
  });

  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

/* Route handlers */

/* Server setup */

const PORT = process.env.PORT || 3001;
const server = express();

// Middleware
server.use(express.static(buildDir));
server.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 99999 }));
server.use(express.json());

// Clean
// --------------------------------------------------------------------
// Dirty

server.get('/', (req, res) => res.sendFile('index.html'));

server.post('/email', (req, res) => {
  let base64str;

  // Read the incoming stream
  req.on('data', (stream) => (base64str += stream));

  // On incoming stream end:
  req.on('end', async () => {
    const to = req.query.to || 'jason@redsundigitalkc.com';
    const filename = Date.now() + '.jpg';

    const { filepath } = await utils.saveBase64Image(base64str, filename);

    if (filepath) {
      mailer
        .sendAttachment(to, filename, filepath)
        .then(() => {
          res.sendStatus(200);

          try {
            const sql = `INSERT INTO users (email) VALUES(?)`;
            const values = [req.query.to];
            db.query(sql, values, (err, results, fields) => {
              if (err) throw err;

              console.log('results', results);
              console.log('fields', fields);
            });
          } catch (err) {
            console.error('db insert error', err);
          }
        })
        .catch(() => res.sendStatus(500));
    }
  });
});

server.get('*', (req, res) => res.redirect('/'));

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
