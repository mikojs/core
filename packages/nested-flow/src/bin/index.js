#! /usr/bin/env node
// @flow

import debug from 'debug';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import statusCommand from 'commands/status';
import stopCommand from 'commands/stop';

handleUnhandledRejection();

const debugLog = debug('nested-flow:bin');

(async () => {
  const { argv, filteredArgv } = await cliOptions(process.argv);

  debugLog({ argv, filteredArgv });

  const command =
    {
      flow: statusCommand,
      'flow-status': statusCommand,
      'flow-stop': stopCommand,
    }[filteredArgv.join('-')] ||
    (() => {
      throw new Error(chalk`{red ${argv.join(' ')}} is not yet supported.`);
    })();
  let hasError: boolean = false;
  /**
   * @example
   * endFunc()
   */
  let endFunc: () => void = () => {};

  for (const folderPath of findFlowDir())
    try {
      debugLog(folderPath);
      endFunc = (await command(argv, folderPath)) || endFunc;
    } catch (e) {
      debugLog(e);
      hasError = true;
    }

  endFunc();
  debugLog(endFunc.toString());

  if (hasError) process.exit(1);
})();
