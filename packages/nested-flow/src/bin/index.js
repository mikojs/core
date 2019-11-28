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
  let hasError: boolean = false;
  /**
   * @example
   * endFunc()
   */
  let endFunc: () => void = () => {};

  for (const folderPath of findFlowDir()) {
    debugLog(folderPath);
    try {
      endFunc = (await command(argv, folderPath)) || endFunc;
    } catch (e) {
      debugLog(e);
      hasError = true;
    }
  }

  endFunc();
  debugLog(endFunc.toString());

  if (hasError) process.exit(1);
})();
