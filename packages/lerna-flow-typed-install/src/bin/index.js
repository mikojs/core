#! /usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import npmWhich from 'npm-which';
import debug from 'debug';
import execa from 'execa';

import { handleUnhandledRejection, requireModule } from '@mikojs/utils';

import logger from 'utils/logger';

const debugLog = debug('lerna-flow-typed-install:bin');

handleUnhandledRejection();

(async () => {
  try {
    const { devDependencies: { 'flow-bin': flowVersion } = {} } = requireModule(
      path.resolve(
        npmWhich(process.cwd()).sync('lerna'),
        '../../../package.json',
      ),
    );

    if (!flowVersion)
      throw logger.fail(
        chalk`Can not find {red flow version} in the project`,
        chalk`Install {red flow} before using {green lerna-flow-typed-install}`,
      );

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
    throw logger.fail(chalk`Can not find {red lerna} in the project`);
  }
})();
