// @flow

import { emptyFunction } from 'fbjs';

/** mock chokidar */
class Chokidar {
  -watchCallback = emptyFunction;

  /**
   * @example
   * chokidar.on();
   *
   * @param {string} type - type to mock
   * @param {Function} callback - callback to mock
   */
  +on = (type: string, callback: emptyFunction) => {
    this.watchCallback = callback;
  };

  /**
   * @example
   * chokidar.watch()
   *
   * @return {Chokidar} - Chokidar class
   */
  +watch = (): Chokidar => this;
}

export default new Chokidar();
