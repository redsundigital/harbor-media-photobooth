const express = require('express');
const path = require('path');
const utils = require('./utils');
const PORT = process.env.PORT || 3001;
const root = path.join(__dirname, 'client');
const app = express();
const mailer = require('./mailer.js');


/* Middleware */

app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 99999 }));
app.use(express.static(root));
app.use(express.json());


/* Routing */

app.get('/', (req, res) => res.sendFile(path.join(root, 'index.html')));

app.post('/email', (req, res) => {
  const filename = Date.now() + '.jpg';
  const to = req.query.to || 'michael.jason@outlook.com';
  let base64str;

  // Read the incoming stream
  req.on('data', stream => base64str += stream);

  // On incoming stream end:
  req.on('end', () => {
    // Save the image so it can be attached to email
    utils.saveBase64Image(base64str, filename)
    .then(data => {
      const { filename, filepath } = data;
      mailer.sendAttachment(to, filename, filepath);
    })
    .catch(console.error);

    res.sendStatus(200);
  });
});

// Redirect bad routes to root.
app.get('*', (req, res) => res.redirect('/'));


/* Start */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});