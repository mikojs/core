// @flow

import utils from './utils';
import writeFiles from './writeFiles';

// eslint-disable-next-line import/exports-last
export type flowFileType = {
  srcPath: string,
  destPath: string,
  filePath: string,
  babelConfigs?: {
    parserOpts: {},
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
    const chokidar = require('chokidar');

    /* eslint-disable flowtype/no-unused-expressions */
    /**
     * flow not yet support
     * $FlowFixMe flow
     */
    this.watcher?.close();
    /* eslint-enable flowtype/no-unused-expressions */
    this.watcher = chokidar.watch(
      this.store.map(({ filePath }: flowFileType) => filePath),
      {
        ignoreInitial: true,
      },
    );

    ['add', 'change'].forEach((type: string) => {
      this.watcher.on(type, (modifyFilePath: string) => {
        writeFiles.add(
          this.store.find(
            ({ filePath }: flowFileType) => modifyFilePath === filePath,
          ),
        );
      });
    });
  };
}

export default new FlowFiles();
