require('dotenv').config();
const nodemailer = require('nodemailer');
const utils = require('./');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const mailOptions = {
  from: `"Harbor Media Photobooth" <${process.env.NODEMAILER_USER}>`,
  subject: 'Your photobooth image',
};

async function sendAttachment(to, filename, filepath) {
  console.log('mailer >', `sending ${filename} to ${to}...`);

  return new Promise((resolve, reject) => {
    const options = {
      ...mailOptions,
      to,
      attachments: [
        {
          filename,
          path: filepath,
          cid: filename,
        },
      ],
      html: `<img src="cid:${filename}"/>
      <br/>
      <p>This is an automatically generated email. Thanks for trying our photobooth app!</p>`,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.error('mailer >', `error sending ${filename} to ${to}: ${err}`);
        reject(err);
      } else {
        // Done with image, delete it:
        utils.deleteFile(filepath);
        console.log(
          'mailer >',
          `attachment ${filename} successfully sent to ${to}: ${info.response}`
        );
        resolve(info);
      }
    });
  });
}

module.exports = { sendAttachment };
