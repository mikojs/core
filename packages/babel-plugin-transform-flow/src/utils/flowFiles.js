// @flow

import chokidar from 'chokidar';

import { name as pkgName } from '../../package.json';

import handler from './handler';
import writeFiles from './writeFiles';

export type flowFileType = {|
  srcPath: string,
  destPath: string,
  filePath: string,
  babelConfig: {
    notInitialized?: boolean,
  },
|};

/**
 * @example
 * new FlowFiles()
 */
class FlowFiles {
  store = [];

  -watcher = null;

  /**
   * @example
   * flowFiles.add({})
   *
   * @param {Object} file - flow file
   */
  +add = (file: flowFileType) => {
    this.store.push(file);

    if (handler.options.watch) this.openWatcher();
  };

  /**
   * @example
   * flowFiles.fileExist('src');
   *
   * @param {string} srcPath - check src path exist
   * @return {boolean} - if path exist, return true
   */
  +fileExist = (srcPath: string) =>
    this.store.some((flowFile: flowFileType) => flowFile.srcPath === srcPath);

  +openWatcher = () => {
    /* eslint-disable flowtype/no-unused-expressions */
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    this.watcher?.close();
    /* eslint-enable flowtype/no-unused-expressions */

    this.watcher = chokidar.watch(
      this.store.map(({ filePath }: flowFileType) => filePath),
      {
        ignoreInitial: true,
      },
    );

    ['add', 'change'].forEach((type: string) => {
      /* eslint-disable flowtype/no-unused-expressions */
      // $FlowFixMe Flow does not yet support method or property calls in optional chains.
      this.watcher?.on(type, (modifyFilePath: string) => {
        /* eslint-enable flowtype/no-unused-expressions */
        const newFile = this.store.find(
          ({ filePath }: flowFileType) => modifyFilePath === filePath,
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
