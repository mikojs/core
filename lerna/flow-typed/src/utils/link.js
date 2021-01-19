// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';
import mkdirp from 'mkdirp';

import { type packageType } from './types';

/**
 * @param {string} folderPath - folder path
 */
const mkdir = (folderPath: string) => {
  if (fs.existsSync(folderPath)) return;

  mkdir(path.dirname(folderPath));
  mkdirp.sync(folderPath);
};

/**
 * @param {string} source - source path
 * @param {string} target - target path
 */
const link = (source: string, target: string) => {
  if (fs.existsSync(target)) return;

  mkdir(path.dirname(target));
  fs.symlinkSync(source, target);
};

/** */
export default async () => {
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
        link(
          path.resolve(rootPath, './.flowconfig'),
          path.resolve(location, './.flowconfig'),
        );
        [dependencies, devDependencies, peerDependencies].forEach(
          (data: ?{| [string]: string |}) => {
            Object.keys(data || {}).forEach((key: string) => {
              const pkg = packages.find(
                ({ name }: packageType) => name === key,
              );

              link(
                pkg?.location || path.resolve(rootPath, './node_modules', key),
                path.resolve(location, './node_modules', key),
              );
            });
          },
        );
      },
    ),
  );
};
