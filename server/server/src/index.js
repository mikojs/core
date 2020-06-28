// @flow

import EventEmitter from 'events';

import { emptyFunction } from 'fbjs';

import { type d3DirTreeOptionsType } from '@mikojs/utils/lib/d3DirTree';

import parseDir from './utils/parseDir';

type returnType = {|
  dev: () => void,
  build: () => void,
  start: () => void,
|};

/**
 * @param {string} folderPath - folder path
 * @param {d3DirTreeOptionsType} options - server options
 *
 * @return {returnType} - server object
 */
export default (
  folderPath: string,
  options: d3DirTreeOptionsType,
): returnType => {
  const events = new EventEmitter();

  return {
    dev: () => parseDir(folderPath, options, events, true),
    build: () => parseDir(folderPath, options, events, false),
    start: emptyFunction,
  };
};
