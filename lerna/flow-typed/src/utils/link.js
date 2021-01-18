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

/**
 * @param {string} flowconfig - the root .flowconfig
 */
export default async (flowconfig: string) => {
  const packages = getPackagesSync();

  await Promise.all(
    packages.map(
      async ({
        rootPath,
        manifestLocation,
        dependencies,
        devDependencies,
        peerDependencies,
      }: packageType) => {
        link(flowconfig, path.resolve(manifestLocation, '../.flowconfig'));

        [dependencies, devDependencies, peerDependencies].forEach(
          (data: ?{| [string]: string |}) => {
            Object.keys(data || {}).forEach((key: string) => {
              const pkg = packages.find(
                ({ name }: packageType) => name === key,
              );

              link(
                pkg
                  ? path.dirname(pkg.manifestLocation)
                  : path.resolve(rootPath, './node_modules', key),
                path.resolve(manifestLocation, '../node_modules', key),
              );
            });
          },
        );
      },
    ),
  );
};
