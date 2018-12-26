#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';
import npmWhich from 'npm-which';
import debug from 'debug';
import execa from 'execa';

import { handleUnhandledRejection } from '@cat-org/utils';
import catLogger, { findSettings } from '@cat-org/logger';

const debugLog = debug('lerna-flow-typed-install:bin');
const logSettings = findSettings('log');
const { error } = console;

handleUnhandledRejection();
logSettings.fail.after = () => {
  error();
  process.exit(1);
};

(async (): Promise<void> => {
  const logger = catLogger('@cat-org/lerna-flow-typed-install', logSettings);

  try {
    const {
      devDependencies: { 'flow-bin': flowVersion } = {},
    } = require(path.resolve(
      npmWhich(process.cwd()).sync('lerna'),
      '../../../package.json',
    ));

    if (!flowVersion)
      logger.fail(
        chalk`Can not find {red flow version} in the project`,
        chalk`Install {red flow} before using {green lerna-flow-typed-install}`,
      );

    await execa.shell(
      `flow-typed install -f ${flowVersion.replace(
        /\^/,
        '',
      )} ${process.argv.slice(2).join(' ')}`,
      {
        stdio: 'inherit',
      },
    );
  } catch (e) {
    debugLog(e);
    logger.fail(chalk`Can not find {red lerna} in the project`);
  }
})();
