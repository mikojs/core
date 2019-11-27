#! /usr/bin/env node
// @flow

import execa from 'execa';
import { areEqual } from 'fbjs';
import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import flowCommand from 'command/flow';

handleUnhandledRejection();

const debugLog = debug('nested-flow:bin');

(async () => {
  const { argv, filteredArgv } = await cliOptions(process.argv);
  const { overwriteArgv, handle, message } =
    [
      flowCommand(),
    ].find(({ keys }: { keys: $ReadOnlyArray<$ReadOnlyArray<string>> }) =>
      keys.some((key: $ReadOnlyArray<string>) => areEqual(key, filteredArgv)),
    ) || {};
  const newArgv = overwriteArgv?.(argv) || argv;

  debugLog({
    argv,
    filteredArgv,
    newArgv,
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    handle: handle?.toString(),
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    message: message?.toString(),
  });

  for (const folder of findFlowDir()) {
    try {
      debugLog(folder);
      await execa(newArgv[0], newArgv.slice(1), {
        cwd: folder,
      });
    } catch (e) {
      // FIXME
      // eslint-disable-next-line flowtype/no-unused-expressions
      handle?.(e.stdout, folder);
    }
  }

  // FIXME
  // eslint-disable-next-line flowtype/no-unused-expressions
  message?.();
})();
