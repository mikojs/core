#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';
import createLogger from '@mikojs/logger';

import { version } from '../../package.json';

import getContext from 'utils/getContext';
import replace from 'utils/replace';

handleUnhandledRejection();

const logger = createLogger('@mikojs/badges');
const parseArgv = commander<[$ReadOnlyArray<string>]>({
  name: 'badges',
  version,
  description: chalk`Add the badges to {green README.md}.`,
  args: '<readme-paths...>',
});

(async () => {
  const [readmePaths] = await parseArgv(process.argv);

  await Promise.all(
    readmePaths.map(async (readmePath: string) => {
      const filePath = path.resolve(readmePath);

      outputFileSync(
        filePath,
        replace(
          fs.readFileSync(filePath, 'utf-8'),
          await getContext(path.dirname(filePath)),
        ),
      );
      logger.success(chalk`Add badges to {gray ${readmePath}}.`);
    }),
  );
})();
