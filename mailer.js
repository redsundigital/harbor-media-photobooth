require('dotenv').config();
const nodemailer = require('nodemailer');
const utils = require('./utils.js');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const mailOptions = {
  from: `"Harbor Media Photobooth" <${process.env.GMAIL_USER}>`,
  subject: 'Your photobooth image'
}

function deleteImage(filepath) {
  utils.deleteFile(filepath)
  .then(file => console.log('deleted: %s', file))
  .catch(console.error)
}

module.exports = {
  sendAttachment: async (to, filename, filepath) => {
    const options = {
      ...mailOptions,
      to,
      html: `<img src="cid:${filename}"/>`,
      attachments: [
        {
          filename,
          path: filepath,
          cid: filename
        }
      ]
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log('nodemailer response: ', info.response)
        deleteImage(filepath);
      }
    });
  }
}