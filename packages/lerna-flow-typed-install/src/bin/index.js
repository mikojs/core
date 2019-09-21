#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import npmWhich from 'npm-which';
import debug from 'debug';
import execa from 'execa';

import {
  handleUnhandledRejection,
  requireModule,
  createLogger,
} from '@mikojs/utils';

const debugLog = debug('lerna-flow-typed-install:bin');
const logger = createLogger('@mikojs/lerna-flow-typed-install');

handleUnhandledRejection();

(async () => {
  try {
    const { devDependencies: { 'flow-bin': flowVersion } = {} } = requireModule(
      path.resolve(
        npmWhich(process.cwd()).sync('lerna'),
        '../../../package.json',
      ),
    );

    if (!flowVersion) {
      logger
        .fail(chalk`Can not find {red flow version} in the project`)
        .fail(
          chalk`Install {red flow} before using {green lerna-flow-typed-install}`,
        );
      process.exit(1);
    }

    const nodeModulesPath = path.resolve('./node_modules');

    if (!fs.existsSync(nodeModulesPath)) fs.mkdirSync(nodeModulesPath);

    await execa(
      'flow-typed',
      [
        'install',
        '-f',
        flowVersion.replace(/\^/, ''),
        ...process.argv.slice(2),
      ],
      {
        stdio: 'inherit',
      },
    );
  } catch (e) {
    debugLog(e);
    logger.fail(chalk`Can not find {red lerna} in the project`);
    process.exit(1);
  }
})();
