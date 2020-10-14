// @flow

import debug from 'debug';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

import watcher, { type callbackType, type closeType } from './watcher';

type toolsType = {|
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: <C>(filePath: string) => C,
  watcher?: (filePath: string, callback: callbackType) => Promise<closeType>,
|};

const debugLog = debug('merge-dir:tools');
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
};

export default {
  /**
   * @param {toolsType} newTools - new tools functions
   */
  set: (newTools: toolsType) => {
    debugLog(newTools);
    Object.keys(newTools).forEach((key: string) => {
      tools[key] = newTools[key];
    });
  },

  /**
   * @param {string} filePath - file path
   * @param {string} content - file content
   */
  writeToCache: (filePath: string, content: string) => {
    tools.writeToCache(filePath, content);
  },

  /**
   * @param {string} filePath - file path
   *
   * @return {any} - get function from the cache
   */
  getFromCache: <C>(filePath: string): C => tools.getFromCache(filePath),

  /**
   * @param {string} filePath - file path
   * @param {callbackType} callback - watcher callback
   *
   * @return {closeType} - close function
   */
  watcher: (filePath: string, callback: callbackType): Promise<closeType> =>
    tools.watcher(filePath, callback),
};
