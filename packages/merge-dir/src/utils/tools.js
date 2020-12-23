// @flow

import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';
import createLogger from '@mikojs/logger';

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
|};

const logger = createLogger('@mikojs/merge-dir:tools');
const tools = {
  writeToCache: outputFileSync,
  getFromCache: requireModule,
  watcher,

  /**
   * @param {toolsType} newTools - new tools functions
   */
  set: (newTools: toolsType) => {
    logger.debug(newTools);
    Object.keys(newTools).forEach((key: string) => {
      tools[key] = newTools[key];
    });
  },
};

export default tools;
