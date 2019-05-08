// @flow

import { emptyFunction } from 'fbjs';

/** mock chokidar */
class Chokidar {
  -watchCallback = emptyFunction;

  +main = {
    on: (type: string, callback: emptyFunction) => {
      this.watchCallback = callback;
    },
    watch: (): $PropertyType<Chokidar, 'main'> => this.main,
  };
}

export const chokidar = new Chokidar();
export default chokidar.main;
