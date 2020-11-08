// @flow

// $FlowFixMe FIXME: could not use module package
import module from 'module';
import vm from 'vm';
import path from 'path';

import { emptyFunction } from 'fbjs';
import debug from 'debug';

import dirTree, { type dirTreeNodeType } from '@mikojs/dir-tree';

import tools from './utils/tools';
import {
  type eventType,
  type callbackType,
  type closeType,
} from './utils/watcher';

import mergeDir from './index';

const debugLog = debug('merge-dir:testing');
const cache = {};

tools.set({
  /**
   * @param {string} filePath - cache file path
   * @param {string} content - cache content
   */
  writeToCache: (filePath: string, content: string) => {
    const context = {};

    debugLog({ filePath, content });
    vm.runInThisContext(module.wrap(content))(
      context,
      require,
      context,
      filePath,
      path.dirname(filePath),
    );
    cache[filePath] = context.exports;
  },

  /**
   * @param {string} filePath - cache file path
   *
   * @return {any} - any function from cache
   */
  getFromCache: <C>(filePath: string): C => {
    debugLog({ filePath });

    return cache[filePath];
  },

  /**
   * @param {string} folderPath - folder path
   * @param {eventType} event - watcher event type
   * @param {callbackType} callback - handle files function
   *
   * @return {Function} - close client
   */
  watcher: async (
    folderPath: string,
    event: eventType,
    callback: callbackType,
  ): Promise<closeType> => {
    debugLog({ folderPath });
    callback(
      dirTree(folderPath, { extensions: /\.js$/ })
        .leaves()
        .map(({ data }: dirTreeNodeType) => ({
          exists: true,
          name: path.relative(folderPath, data.path),
        })),
    );

    return emptyFunction;
  },
});

export default mergeDir;
