// @flow

import { emptyFunction } from 'fbjs';

/**
 * @example
 * new OutPutFileSync()
 */
class OutPutFileSync {
  destPaths = [];

  mainFunction = emptyFunction;

  /**
   * @example
   * outputFileSync.main('test');
   *
   * @param {string} destPath - dest path to add
   */
  main = (destPath: string) => {
    this.mainFunction();
    this.mainFunction = emptyFunction;
    this.destPaths.push(destPath);
  };
}

export const outputFileSync = new OutPutFileSync();
export default outputFileSync.main;
