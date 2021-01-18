// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';
import mkdirp from 'mkdirp';

import { requireModule } from '@mikojs/utils';

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
    packages.map(async ({ manifestLocation }: packageType) => {
      const { dependencies, devDependencies, peerDependencies } = requireModule(
        manifestLocation,
      );
      const shouldLinkPackages = [
        dependencies,
        devDependencies,
        peerDependencies,
      ].reduce(
        (result: $ReadOnlyArray<string>, data: ?{| [string]: string |}) => [
          ...result,
          ...packages.filter(({ name }: packageType) =>
            Object.keys(data || {}).some((pkgName: string) => pkgName === name),
          ),
        ],
        [],
      );

      link(flowconfig, path.resolve(manifestLocation, '../.flowconfig'));
      shouldLinkPackages.forEach(
        ({
          name,
          manifestLocation: shouldLinkPackageManifestLocation,
        }: packageType) => {
          link(
            path.dirname(shouldLinkPackageManifestLocation),
            path.resolve(manifestLocation, '../node_modules', name),
          );
        },
      );
    }),
  );
};
