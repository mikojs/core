// @flow

import { emptyFunction } from 'fbjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { outputFileSync } from 'output-file-sync';

/** mock fs */
class Fs {
  exist = false;

  main = {
    ...jest.requireActual('fs'),
    existsSync: (filePath: string) =>
      outputFileSync.destPaths.includes(filePath) || this.exist,
    readFileSync: (filePath: string): string => {
      const index = [...outputFileSync.destPaths].reverse().indexOf(filePath);

      if (index === -1) throw new Error(`Can not find ${filePath}`);

      return [...outputFileSync.contents].reverse()[index];
    },
    mkdirSync: emptyFunction,
    rmdirSync: emptyFunction,
    createWriteStream: emptyFunction.thatReturnsArgument,
  };
}

const fs = new Fs();
fs.main.fs = fs;

export default fs.main;
