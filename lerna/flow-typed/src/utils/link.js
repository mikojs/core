// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';
import mkdirp from 'mkdirp';

import { type packageType } from './types';
import rimrafSync from './rimrafSync';

/**
 * @param {string} source - source path
 * @param {string} target - target path
 * @param {boolean} remove - remove linked files or not
 */
const link = async (source: string, target: string, remove: boolean) => {
  if (remove) {
    if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink())
      await rimrafSync(target);

    return;
  }

  if (fs.existsSync(target)) return;

  mkdirp.sync(path.dirname(target));
  fs.symlinkSync(source, target);
};

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
        await link(
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

                await link(
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
