// @flow

import { emptyFunction } from 'fbjs';

/** mock fs */
class Fs {
  exist = false;

  main = {
    existsSync: () => this.exist,
    mkdirSync: emptyFunction,
    rmdirSync: emptyFunction,
  };
}

export const fs = new Fs();
export default fs.main;
