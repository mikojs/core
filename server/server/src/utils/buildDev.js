// @flow

import readFiles, { type optionsType, type callbackType } from './readFiles';

export type returnType = (options: optionsType) => void;

const callbacks = [];

/**
 * @param {callbackType} dev - originial dev function
 * @param {optionsType} options - read files options
 *
 * @return {returnType} - dev function
 */
export default (dev: callbackType, options: optionsType): returnType => {
  callbacks.push(() => {
    readFiles(options, dev);
  });

  return () => {
    callbacks.map((callback: () => void) => callback());
  };
};
