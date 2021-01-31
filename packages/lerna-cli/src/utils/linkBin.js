// @flow

import path from 'path';

import { getPackagesSync } from '@lerna/project';

import { type packageType } from './types';
import symlinkSync from './symlinkSync';

/**
 * @param {boolean} remove - remove the linked files or not
 *
 * @return {Promise} - the result of the link command
 */
export default (remove: boolean): Promise<void> =>
  Promise.all(
    getPackagesSync().reduce(
      (
        result: $ReadOnlyArray<Promise<void>>,
        { bin, rootPath, location }: packageType,
      ) => [
        ...result,
        ...Object.keys(bin).map((key: string) =>
          symlinkSync(
            path.resolve(rootPath, './node_modules/.bin', key),
            path.resolve(location, bin[key]),
            remove,
          ),
        ),
      ],
      [],
    ),
  );
