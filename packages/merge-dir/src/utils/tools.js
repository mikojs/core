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

  /**
   * @param {toolsType} newTools - new tools functions
   */
  set: (newTools: toolsType) => {
    debugLog(newTools);
    Object.keys(newTools).forEach((key: string) => {
      tools[key] = newTools[key];
    });
  },
};

export default tools;
