import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

export default async (source, target, remove) => {
  if (remove) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      await new Promise((resolve, reject) => {
        rimraf(target, err => {
          if (err) reject(err);
          else resolve();
        });
      });

    return;
  }

  if (!fs.existsSync(source) || fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};
