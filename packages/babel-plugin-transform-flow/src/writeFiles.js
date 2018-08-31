// @flow

import { transformFileSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

import { name as pkgName } from '../package.json';

import utils from './utils';

export type writeFileType = {
  srcPath: string,
  destPath: string,
  babelConfigs: {
    parserOpts: {},
    notInitialized?: boolean,
  },
};

/**
 * @example
 * new WriteFiles()
 */
class WriteFiles {
  store = [];

  isWritting = false;

  /**
   * @example
   * flowFiles.add({ srcPath, destPath });
   *
   * @param {Object} file - file information
   */
  add = (file: writeFileType) => {
    this.store.push(file);

    if (!this.isWritting) this.writeFiles();
  };

  writeFiles = () => {
    this.isWritting = true;

    const { verbose, watch } = utils.options;
    const { srcPath, destPath, babelConfigs } = this.store.pop();

    try {
      const { code }: { code: string } = transformFileSync(
        srcPath,
        babelConfigs,
      );

      this.store = this.store.filter(
        (writeFile: writeFileType): boolean => writeFile.srcPath !== srcPath,
      );

      outputFileSync(destPath, code);
      this.isWritting = false;

      // eslint-disable-next-line no-console
      if (verbose) console.log(`${srcPath} -> ${destPath}`);
      if (this.store.length !== 0) this.writeFiles();
    } catch (e) {
      const errorMessage = `${pkgName} ${e}`;

      this.isWritting = false;

      // eslint-disable-next-line no-console
      if (watch) console.log(errorMessage);
      else throw new Error(errorMessage);
    }
  };
}

export default new WriteFiles();
