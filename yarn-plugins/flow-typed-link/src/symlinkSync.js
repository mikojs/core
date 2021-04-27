import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

export default (source, target) => {
  if (!fs.existsSync(source) || fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};
