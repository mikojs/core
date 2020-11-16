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
    .filter(({ manifestLocation }: packageType): boolean => {
      const filePath = path.resolve(manifestLocation, '../.flowconfig');

      return (
        fs.existsSync(filePath) && !fs.lstatSync(filePath).isSymbolicLink()
      );
    })
    .map(({ name }: packageType) => `--ignore ${name}`)
    .join(' ');
