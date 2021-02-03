// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

/**
 * @param {string} source - source path
 * @param {string} target - target path
 * @param {boolean} remove - remove linked files or not
 */
export default async (source: string, target: string, remove: boolean) => {
  if (remove) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      await new Promise((resolve, reject) => {
        rimraf(target, (err?: mixed) => {
          if (err) reject(err);
          else resolve();
        });
      });

    return;
  }

  if (fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};
