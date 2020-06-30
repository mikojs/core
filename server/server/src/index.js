// @flow

import EventEmitter from 'events';

import { emptyFunction } from 'fbjs';

import parseDir, { type optionsType } from './utils/parseDir';

type returnType = {|
  dev: () => void,
  build: () => void,
  start: () => void,
|};

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - server options
 *
 * @return {returnType} - server object
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): returnType => {
  const events = new EventEmitter();

  return {
    dev: () => parseDir(folderPath, options, events, true),
    build: () => parseDir(folderPath, options, events, false),
    start: emptyFunction,
  };
};
