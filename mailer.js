require('dotenv').config();
const nodemailer = require('nodemailer');
const utils = require('./utils.js');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

const mailOptions = {
  from: `"Harbor Media Photobooth" <${process.env.NODEMAILER_USER}>`,
  subject: 'Your photobooth image'
};

async function sendAttachment(to, filename, filepath) {
  return new Promise((resolve, reject) => {
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
        reject(err);
      } else {
        // Done with image, delete it:
        utils.deleteFile(filepath);
        resolve(info);
      }
    });
  });
}

module.exports = { sendAttachment };
