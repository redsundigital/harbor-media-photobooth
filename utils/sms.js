require('dotenv').config();
const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendMms(body, to, mediaUrl) {
  return new Promise((resolve, reject) => {
    console.log('sms >', `sending mms to ${to}...`);

    client.messages
      .create({ body, from, to, mediaUrl })
      .then((response) => {
        console.log('sms >', `mms sent to ${to}`);
        resolve(response);
      })
      .catch((err) => {
        console.error('sms >', `error sending mms to ${to}: ${err}`);
        reject(err);
      });
  });
}

module.exports = { sendMms };

/* SMS stuff for server.js, put here to keep file clean */
/*
const sms = require('./utils/sms.js');
const imgur = require('./utils/imgur.js');
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
      await sms.sendMms('nodejs', to, [link]).catch(console.error);
      if (deletehash) {
        imgur.deleteImage(deletehash);
      }
      res.sendStatus(200);
    }
  });
});
*/
