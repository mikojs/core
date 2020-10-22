// @flow

import debug from 'debug';
import outputFileSync from 'output-file-sync';
import { emptyFunction } from 'fbjs';

import { requireModule } from '@mikojs/utils';

import watcher, {
  type eventType,
  type callbackType,
  type closeType,
} from './watcher';

export type fileDataType = {|
  exists: boolean,
  filePath: string,
  pathname: string,
|};

export type toolsType = {|
  writeToCache?: (filePath: string, content: string) => void,
  getFromCache?: <C>(filePath: string) => C,
  watcher?: (
    filePath: string,
    event: eventType,
    callback: callbackType,
  ) => Promise<closeType>,
  log?: (fileData: fileDataType | 'done') => void,
|};

const debugLog = debug('merge-dir:tools');
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,
  log: emptyFunction,

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
