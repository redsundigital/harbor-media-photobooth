/**
 * Returns a string of randomized alphanumeric characters.
 * From {@link https://stackoverflow.com/a/1349426}.
 *
 * @param {Number} length Length of the id created.
 */
export const generateId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
