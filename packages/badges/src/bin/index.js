#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import chalk from 'chalk';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection } from '@mikojs/utils';

import logger from 'utils/logger';
import cliOptions from 'utils/cliOptions';
import badges from 'utils/badges';

handleUnhandledRejection();

(async () => {
  await Promise.all(
    cliOptions(process.argv).map(async (cwd: string) => {
      const { path: pkgPath, package: pkg } = await readPkgUp({
        cwd: path.resolve(cwd),
      });

      if (!pkgPath)
        throw logger.fail(
          'Can not find the root path',
          chalk`Create a {green package.json} first`,
        );

      const rootPath = path.dirname(pkgPath);
      const readmePath = path.resolve(rootPath, 'README.md');

      if (!fs.existsSync(readmePath))
        throw logger.fail(
          chalk`Can not find the {green README.md} in the root folder`,
          chalk`Create a {green README.md} first`,
        );

      outputFileSync(
        readmePath,
        await badges(fs.readFileSync(readmePath, 'utf-8'), {
          rootPath,
          pkg,
        }),
      );

      logger.succeed(
        `"${path.relative(process.cwd(), path.resolve(cwd))}" done`,
      );
    }),
  );
})();
