// @flow

import chokidar from 'chokidar';

import utils from './utils';
import writeFiles from './writeFiles';

export type flowFileType = {
  srcPath: string,
  destPath: string,
  filePath: string,
  babelConfigs: {
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
        if (!newFile.babelConfigs)
          throw new Error(
            `@cat-org/babel-plugin-transform-flow Error: not find ${
              newFile.srcPath
            } babel configs`,
          );

        writeFiles.add(newFile);
      });
    });
  };
}

export default new FlowFiles();
