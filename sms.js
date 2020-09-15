require('dotenv').config();
const twilio = require('twilio');

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const from = '+12562978905';
const me = '+19136878235';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

module.exports = {
  sendMms(body, to, mediaUrl) {
    client.messages
      .create({ body, from, to, mediaUrl })
      .then(console.log);
  }
}