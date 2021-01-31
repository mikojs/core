// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

/**
 * @param {string} filePath - file path
 *
 * @return {Promise} - the result of the rimraf
 */
const rimrafSync = (filePath: string) =>
  new Promise((resolve, reject) => {
    rimraf(filePath, (err?: mixed) => {
      if (err) reject(err);
      else resolve();
    });
  });

/**
 * @param {string} source - source path
 * @param {string} target - target path
 * @param {boolean} remove - remove linked files or not
 */
export default async (source: string, target: string, remove: boolean) => {
  if (remove) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      await rimrafSync(target);

    return;
  }

  if (fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};
