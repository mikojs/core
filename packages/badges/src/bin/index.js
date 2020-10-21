#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import readPkgUp from 'read-pkg-up';
import chalk from 'chalk';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

import getBadgesOptions from 'utils/getBadgesOptions';
import addBadges from 'utils/addBadges';

handleUnhandledRejection();

const logger = createLogger('@mikojs/badges');

(async () => {
  await Promise.all(
    (
      await getBadgesOptions(process.argv).catch((err: Error): [] => {
        process.exit(1);

        return [];
      })
    ).map(async (cwd: string) => {
      const { path: pkgPath, packageJson: pkg } = await readPkgUp({
        cwd: path.resolve(cwd),
      });

      if (!pkgPath) {
        logger
          .fail('Can not find the root path')
          .fail(chalk`Create a {green package.json} first`);
        process.exit(1);
      }

      const rootPath = path.dirname(pkgPath);
      const readmePath = path.resolve(rootPath, 'README.md');

      if (!fs.existsSync(readmePath)) {
        logger
          .fail(chalk`Can not find the {green README.md} in the root folder`)
          .fail(chalk`Create a {green README.md} first`);
        process.exit(1);
      }

      const content = await addBadges(fs.readFileSync(readmePath, 'utf-8'), {
        rootPath,
        pkg,
      });

      if (!content) process.exit(1);

      outputFileSync(readmePath, content);

      logger.succeed(
        chalk`{gray ${path.relative(process.cwd(), path.resolve(cwd))}}`,
      );
    }),
  );
})();
