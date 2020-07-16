// @flow

import readFiles, { type optionsType, type callbackType } from './readFiles';

export type returnType = (options: optionsType) => void;

const callbacks = [];

/**
 * @param {callbackType} dev - originial dev function
 *
 * @return {returnType} - dev function
 */
export default (dev: callbackType): returnType => {
  callbacks.push((options: optionsType) => {
    readFiles(options, dev);
  });

  return (options: optionsType) => {
    callbacks.map((callback: (options: optionsType) => void) =>
      callback(options),
    );
  };
};
