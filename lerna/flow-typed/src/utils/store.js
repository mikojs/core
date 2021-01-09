// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';
import rimraf from 'rimraf';
import copyDir from 'copy-dir';
import findCacheDir from 'find-cache-dir';

const cacheDir = findCacheDir({ name: '@mikojs/flow-typed', thunk: true });

/**
 * @param {boolean} restore - restore cache or not
 */
export default async (restore?: boolean) => {
  if (restore && !fs.existsSync(cacheDir())) return;

  await Promise.all(
    getPackagesSync().map(
      async ({
        name,
        manifestLocation,
      }: {|
        name: string,
        manifestLocation: string,
      |}) => {
        const folders = [
          path.resolve(manifestLocation, '../flow-typed/npm'),
          cacheDir(name),
        ];

        if (restore) folders.reverse();

        const [sourceFolder, targetFolder] = folders;

        if (!fs.existsSync(sourceFolder)) return;

        if (fs.existsSync(targetFolder))
          await new Promise((resolve, reject) =>
            rimraf(targetFolder, (err?: mixed) => {
              if (err) reject(err);
              else resolve();
            }),
          );

        copyDir.sync(sourceFolder, targetFolder);
      },
    ),
  );
};
