#! /usr/bin/env node
// @flow

import execa from 'execa';
import { areEqual } from 'fbjs';
import debug from 'debug';
import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';

import { type commandType } from '../types';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import flowCommand from 'command/flow';

handleUnhandledRejection();

const debugLog = debug('nested-flow:bin');

(async () => {
  const { argv, filteredArgv } = await cliOptions(process.argv);
  const command =
    [flowCommand()].find(({ keys }: commandType) =>
      keys.some((key: $ReadOnlyArray<string>) => areEqual(key, filteredArgv)),
    ) ||
    (() => {
      throw new Error(chalk`{red ${argv.join(' ')}} is not yet supported.`);
    })();
  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
  const newArgv = command.overwriteArgv?.(argv) || argv;

  debugLog(command);

  for (const folder of findFlowDir()) {
    try {
      debugLog(folder);

      const { stdout } = await execa(newArgv[0], newArgv.slice(1), {
        cwd: folder,
      });

      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      command.success?.(stdout, folder); // eslint-disable-line flowtype/no-unused-expressions
    } catch (e) {
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      command.fail?.(e.stdout, folder); // eslint-disable-line flowtype/no-unused-expressions
    }
  }

  // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
  process.exit(command.end?.() || 0);
})();
