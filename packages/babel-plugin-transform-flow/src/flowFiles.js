// @flow

import chokidar from 'chokidar';

import { name as pkgName } from '../package.json';

import utils from './utils';
import writeFiles from './writeFiles';

export type flowFileType = {
  srcPath: string,
  destPath: string,
  filePath: string,
  babelConfig: {
    parserOpts: {},
    notInitialized?: boolean,
  },
};

/**
 * @example
 * new FlowFiles()
 */
class FlowFiles {
  store = [];

  watcher = null;

  /**
   * @example
   * flowFiles.add({})
   *
   * @param {Object} file - flow file
   */
  add = (file: flowFileType) => {
    this.store.push(file);

    if (utils.options.watch) this.openWatcher();
  };

  /**
   * @example
   * flowFiles.fileExist('src');
   *
   * @param {string} srcPath - check src path exist
   * @return {boolean} - if path exist, return true
   */
  fileExist = (srcPath: string): boolean =>
    this.store.some(
      (flowFile: flowFileType): boolean => flowFile.srcPath === srcPath,
    );

  openWatcher = () => {
    /* eslint-disable flowtype/no-unused-expressions */
    // $FlowFixMe flow not yet supporte
    this.watcher?.close();
    /* eslint-enable flowtype/no-unused-expressions */

    this.watcher = chokidar.watch(
      this.store.map(({ filePath }: flowFileType): string => filePath),
      {
        ignoreInitial: true,
      },
    );

    ['add', 'change'].forEach((type: string) => {
      /* eslint-disable flowtype/no-unused-expressions */
      // $FlowFixMe flow not yet support
      this.watcher?.on(type, (modifyFilePath: string) => {
        /* eslint-enable flowtype/no-unused-expressions */
        const newFile = this.store.find(
          ({ filePath }: flowFileType): boolean => modifyFilePath === filePath,
        );

        if (!newFile) return;
        if (!newFile.babelConfig)
          throw new Error(
            `${pkgName} Error: not find ${newFile.srcPath} babel config`,
          );

        writeFiles.add(newFile);
      });
    });
  };
}

export default new FlowFiles();
