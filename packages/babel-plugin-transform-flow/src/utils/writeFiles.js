// @flow

import { transformFileSync } from '@babel/core';
import outputFileSync from 'output-file-sync';

import { name as pkgName } from '../../package.json';

import handler from './handler';

export type writeFileType = {
  srcPath: string,
  destPath: string,
  babelConfig: {
    notInitialized?: boolean,
  },
};

/**
 * @example
 * new WriteFiles()
 */
class WriteFiles {
  // This can be modify in class
  // eslint-disable-next-line flowtype/no-mutable-array
  store: Array<writeFileType> = [];

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

    const { verbose, watch } = handler.options;
    const { srcPath, destPath, babelConfig } = this.store.pop();
    const { log } = console;

    try {
      const { code }: { code: string } = transformFileSync(
        srcPath,
        babelConfig,
      );

      this.store = this.store.filter(
        (writeFile: writeFileType): boolean => writeFile.srcPath !== srcPath,
      );

      outputFileSync(
        destPath,
        code.replace(/fixme-flow-file-annotation/, '@flow'),
      );
      this.isWritting = false;

      if (verbose) log(`${srcPath} -> ${destPath}`);
      if (this.store.length !== 0) this.writeFiles();
    } catch (e) {
      const errorMessage = `${pkgName} ${e}`;

      this.isWritting = false;

      if (watch) log(errorMessage);
      else throw new Error(errorMessage);
    }
  };
}

export default new WriteFiles();
