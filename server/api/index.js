const utils = require('../utils');
const mailer = require('../utils/mailer');
const users = require('../users');

module.exports.handleEmailPhoto = (req, res) => {
  let base64str;

  // Read the incoming stream
  req.on('data', (stream) => (base64str += stream));

  // On incoming stream end:
  req.on('end', async () => {
    const emailTo = req.query.to;
    const imageName = Date.now() + '.jpg';
    const { filepath: imagePath } = await utils.saveBase64Image(base64str, imageName);

    // Validate email
    const validEmail = utils.validateEmail(emailTo);
    if (!validEmail) {
      res.send(400);
      return;
    }

    // Send the email if the image exists
    if (imagePath) {
      mailer
        .sendAttachment(emailTo, imageName, imagePath)
        .then(() => {
          users.addEmail(emailTo, (err, results) => {
            res.send(err ? 500 : 201);
          });
        })
        .catch(() => res.send(500));
    } else {
      res.send(404);
    }
  });
};
