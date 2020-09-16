const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Takes a base64 image string and saves it to an image file. 
   * Returns `{filename, filepath}` on resolve,
   * and an error on reject.
   */
  saveBase64Image: (stream, filename) => new Promise((resolve, reject) => {
    console.log('utils > ', `uploading file: ${filename}...`);

    // Strip meta data (sometimes begins with undefined, hence ^.+ at start). 
    const file = stream.replace(/^.+data:image\/\w+;base64,/, '');

    // Write file
    const filepath = path.join(__dirname, '..', 'downloads', filename);
    const writeOptions = { encoding: 'base64' };
    fs.writeFile(filepath, file, writeOptions, err => {
      if (err) {
        console.error('utils >', `base64 upload error: ${err}`);
        reject(err);
      } else {
        console.log('utils > ', `file uploaded: ${filename}`);
        resolve({ filename, filepath });
      }
    });
  }),
  /**
   * Removes a file by a filepath. 
   * Rejects with an error if it exists, resolves with the filepath used to delete.
   */
  deleteFile: (filepath) => new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error('utils >', `file delete error: ${err}`);
        reject(err);
      } else {
        console.log('utils >', `file deleted: ${filepath}`);
        resolve(filepath);
      }
    });
  })
}
