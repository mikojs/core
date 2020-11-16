// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';

import { type packageType } from './types';

/**
 * @return {string} - ignore custom flow config package
 */
export default (): string =>
  getPackagesSync()
    .filter(
      ({ manifestLocation }: packageType) =>
        !fs
          .lstatSync(path.resolve(manifestLocation, '../.flowconfig'))
          .isSymbolicLink(),
    )
    .map(({ name }: packageType) => `--ignore ${name}`)
    .join(' ');
