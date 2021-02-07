// @flow

import path from 'path';

import { getPackagesSync } from '@lerna/project';

import { type packageType } from './types';
import symlinkSync from './symlinkSync';

/**
 * @param {boolean} remove - remove linked files or not
 */
export default async (remove: boolean) => {
  const packages = getPackagesSync();

  await Promise.all(
    packages.map(
      async ({
        location,
        rootPath,
        dependencies,
        devDependencies,
        peerDependencies,
      }: packageType) => {
        await symlinkSync(
          path.resolve(rootPath, './.flowconfig'),
          path.resolve(location, './.flowconfig'),
          remove,
        );
        await Promise.all(
          [dependencies, devDependencies, peerDependencies].reduce(
            (
              result: $ReadOnlyArray<Promise<void>>,
              data: ?{| [string]: string |},
            ) => [
              ...result,
              ...Object.keys(data || {}).map(async (key: string) => {
                const pkg = packages.find(
                  ({ name }: packageType) => name === key,
                );

                await symlinkSync(
                  pkg?.location ||
                    path.resolve(rootPath, './node_modules', key),
                  path.resolve(location, './node_modules', key),
                  remove,
                );
              }),
            ],
            [],
          ),
        );
      },
    ),
  );
};
