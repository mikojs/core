#! /usr/bin/env node
// @flow

import debug from 'debug';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import commands from 'commands';

handleUnhandledRejection();

const debugLog = debug('nested-flow:bin');

(async () => {
  const { argv, filteredArgv } = await cliOptions(process.argv);

  debugLog({ argv, filteredArgv });

  const command =
    commands[filteredArgv.join('-')] ||
    (() => {
      throw new Error(chalk`{red ${argv.join(' ')}} is not yet supported.`);
    })();

  for (const folderPath of findFlowDir()) {
    debugLog(folderPath);
    await command(argv, folderPath);
  }
})();
