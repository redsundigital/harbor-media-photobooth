const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Takes a base64 image string and saves it to an image file. 
   * Returns `{filename, filepath}` on resolve,
   * and an error on reject.
   */
  saveBase64Image: (stream, filename) => new Promise((resolve, reject) => {
    // Strip meta data (sometimes begins with undefined, hence ^.+ at start). 
    const file = stream.replace(/^.+data:image\/\w+;base64,/, '');

    // Write file
    const filepath = path.join(__dirname, 'downloads', filename);
    const writeOptions = { encoding: 'base64' };
    fs.writeFile(filepath, file, writeOptions, err => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log('file uploaded: ' + filename);
      resolve({ filename, filepath });
    });
  }),
  /**
   * Removes a file by a filepath. 
   * Rejects with an error if it exists, resolves with the filepath used to delete.
   */
  deleteFile: (filepath) => new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filepath);
      }
    });
  })
}