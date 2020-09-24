require('dotenv').config();
const express = require('express');
const path = require('path');
const utils = require('./utils/utils.js');
const mailer = require('./utils/mailer.js');
// const sms = require('./utils/sms.js');
// const imgur = require('./utils/imgur.js');


const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 99999 }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

app.get('/', (req, res) => res.sendFile('index.html'));

app.post('/email', (req, res) => {
  let base64str;

  // Read the incoming stream
  req.on('data', stream => base64str += stream);

  // On incoming stream end:
  req.on('end', async () => {
    const to = req.query.to || 'jason@redsundigitalkc.com';
    const filename = Date.now() + '.jpg';

    const { filepath } = await utils.saveBase64Image(base64str, filename);

    if (filepath) {
      mailer.sendAttachment(to, filename, filepath)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    }
  });
});

// app.post('/sms', (req, res) => {
//   const to = req.query.to || '+19136878235';
//   let base64str;

//   // Read the incoming stream
//   req.on('data', stream => base64str += stream);

//   // On incoming stream end:
//   req.on('end', async () => {
//     let deletehash;
//     let link;

//     // Upload image
//     await imgur.uploadBase64Image(base64str)
//       .then(response => {
//         deletehash = response.data.data.deletehash;
//         link = response.data.data.link;
//       })
//       .catch(console.error);

//     // Send mms
//     if (link) {
//       await sms.sendMms('nodejs', to, [link]).catch(console.error);
//       if (deletehash) {
//         imgur.deleteImage(deletehash);
//       }
//       res.sendStatus(200);
//     }
//   });
// });

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
