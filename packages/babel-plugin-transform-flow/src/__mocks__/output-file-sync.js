// @flow

/**
 * @example
 * new OutPutFileSync()
 */
class OutPutFileSync {
  destPaths = [];

  /**
   * @example
   * outputFileSync.resetDestPaths()
   */
  resetDestPaths = () => {
    this.destPaths = [];
  };

  /**
   * @example
   * outputFileSync.getDestPaths()
   *
   * @return {Array} - dest paths
   */
  getDestPaths = (): $ReadOnlyArray<string> => this.destPaths;

  /**
   * @example
   * outputFileSync.main('test');
   *
   * @param {string} destPath - dest path to add
   */
  main = (destPath: string) => {
    this.destPaths.push(destPath);
  };
}

const outputFileSync = new OutPutFileSync();

export const resetDestPaths = outputFileSync.resetDestPaths;
export const getDestPaths = outputFileSync.getDestPaths;
export default outputFileSync.main;
