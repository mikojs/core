// @flow

/**
 * @example
 * new OutPutFileSync()
 */
class OutPutFileSync {
  destPaths = [];

  mainFunction = () => {};

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
   * outputFileSync.setMainFunction()
   *
   * @param {Function} mainFunction - main function to mock event
   */
  setMainFunction = (mainFunction: () => {}) => {
    this.mainFunction = mainFunction;
  };

  /**
   * @example
   * outputFileSync.main('test');
   *
   * @param {string} destPath - dest path to add
   */
  main = (destPath: string) => {
    this.mainFunction();
    this.mainFunction = () => {};
    this.destPaths.push(destPath);
  };
}

const outputFileSync = new OutPutFileSync();

export const { resetDestPaths, getDestPaths, setMainFunction } = outputFileSync;
export default outputFileSync.main;
