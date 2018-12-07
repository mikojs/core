// @flow

import path from 'path';

type callbackType = (error: boolean, filePath: string) => void;

type findFuncType = (cliName: string, callback: callbackType) => void;

/** mock npmWhich */
class NpmWhich {
  throwError = false;

  alias = {};

  /**
   * @example
   * npmWhich.main()
   *
   * @return {Function} - mock npm-which function
   */
  main = (): findFuncType => {
    /**
     * @example
     * findFunc('cliName', (err, value) => {
     * })
     *
     * @param {string} cliName - cli name
     * @param {Function} callback - callback function
     */
    const findFunc = (cliName: string, callback: callbackType) => {
      callback(
        this.throwError,
        path.resolve('./node_modules/.bin', this.alias[cliName] || cliName),
      );
    };

    findFunc.sync = (cliName: string): string => {
      if (this.throwError) throw new Error(`not found: ${cliName}`);

      return path.resolve(
        './node_modules/.bin',
        this.alias[cliName] || cliName,
      );
    };

    return findFunc;
  };
}

export const npmWhich = new NpmWhich();
export default npmWhich.main;
