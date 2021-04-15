import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

const rimrafSync = promisify(rimraf);

export default async (source, target, remove) => {
  if (remove) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      await rimrafSync(target);

    return;
  }

  if (!fs.existsSync(source) || fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};
