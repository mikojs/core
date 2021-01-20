// @flow

import rimraf from 'rimraf';

/**
 * @param {string} filePath - file path
 *
 * @return {Promise} - the result of the rimraf
 */
export default (filePath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    rimraf(filePath, (err?: mixed) => {
      if (err) reject(err);
      else resolve();
    });
  });
