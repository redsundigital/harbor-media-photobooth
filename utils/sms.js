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
            .then(response => {
                console.log('sms >', `mms sent to ${to}`);
                resolve(response);
            })
            .catch(err => {
                console.error('sms >', `error sending mms to ${to}: ${err}`);
                reject(err);
            });
    });
} 

module.exports = { sendMms };
