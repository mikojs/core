// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';
import rimraf from 'rimraf';

/** */
export default async () => {
  await Promise.all(
    getPackagesSync().map(
      async ({ manifestLocation }: { manifestLocation: string }) => {
        const flowconfig = path.resolve(manifestLocation, '../.flowconfig');

        if (
          !fs.existsSync(flowconfig) ||
          !fs.lstatSync(flowconfig).isSymbolicLink()
        )
          return;

        await new Promise((resolve, reject) => {
          rimraf(flowconfig, (err?: mixed) => {
            if (err) reject(err);
            else resolve();
          });
        });
      },
    ),
  );
};
