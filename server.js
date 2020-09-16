require('dotenv').config();
const express = require('express');
const path = require('path');
const utils = require('./utils');
const mailer = require('./mailer.js');
const sms = require('./sms.js');
const imgur = require('./imgur.js');


const PORT = process.env.PORT || 3001;
const root = path.join(__dirname, 'client');
const app = express();

/* Middleware */

app.use(express.urlencoded({ extended: false, limit: '50mb', parameterLimit: 99999 }));
app.use(express.static(root));
app.use(express.json());


/* Routing */

app.get('/', (req, res) => res.sendFile(path.join(root, 'index.html')));

app.post('/email', (req, res) => {
    const filename = Date.now() + '.jpg';
    const to = req.query.to || 'jason@redsundigitalkc.com';
    let base64str;

    // Read the incoming stream
    req.on('data', stream => base64str += stream);

    // On incoming stream end:
    req.on('end', () => {
        // Save the image so it can be attached to email
        utils.saveBase64Image(base64str, filename)
            .then(data => {
                // Send the email
                const { filename, filepath } = data;
                mailer.sendAttachment(to, filename, filepath)
                    .then(() => res.sendStatus(200))
                    .catch(err => res.sendStatus(500));
            })
            .catch(err => res.sendStatus(500));
    });
});

app.post('/sms', (req, res) => {
    const to = req.query.to || '+19136878235';
    let base64str;

    // Read the incoming stream
    req.on('data', stream => base64str += stream);

    // On incoming stream end:
    req.on('end', async () => {
        let deletehash;
        let link;

        // Upload image
        await imgur.uploadBase64Image(base64str)
        .then(response => {
            deletehash = response.data.data.deletehash;
            link = response.data.data.link;
        })
        .catch(console.error);

        // Send mms
        if (link) {
            sms.sendMms('nodejs', to, [link])
            .then(console.log)
            .catch(console.error);
        }

        // Delete image
        if (deletehash) {

        }

    });
});

// Redirect bad routes to root.
app.get('*', (req, res) => res.redirect('/'));


/* Start */

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
