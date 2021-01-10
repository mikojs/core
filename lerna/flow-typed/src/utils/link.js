// @flow

import fs from 'fs';
import path from 'path';

import { getPackagesSync } from '@lerna/project';

/**
 * @param {string} flowconfig - the root .flowconfig
 */
export default async (flowconfig: string) => {
  await Promise.all(
    getPackagesSync().map(
      async ({ manifestLocation }: {| manifestLocation: string |}) => {
        const targetFlowconfig = path.resolve(
          manifestLocation,
          '../.flowconfig',
        );

        if (fs.existsSync(targetFlowconfig)) return;

        fs.symlinkSync(flowconfig, targetFlowconfig);
      },
    ),
  );
};
