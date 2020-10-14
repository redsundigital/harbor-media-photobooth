const dbconn = require('./database');

module.exports = {
  /**
   * Adds a user's email to the database.
   *
   * @param {String} email The email to insert.
   * @param {*} callback Returns `(error, results)`.
   */
  addEmail(email, callback) {
    const sql = `INSERT INTO users (email) VALUES(?)`;
    dbconn.query(sql, [email], callback);
  },
};
