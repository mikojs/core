#! /usr/bin/env node
// @flow

import execa from 'execa';
import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import flowMessage from 'message/flow';

handleUnhandledRejection();

const debugLog = debug('nested-flow:bin');

(async () => {
  const argv = await cliOptions(process.argv);
  const { handle, message } =
    [flowMessage()].find(
      ({ keys }: { keys: $ReadOnlyArray<string> }) =>
        keys.length === argv.length &&
        keys.every((key: string) => argv.includes(key)),
    ) || {};

  debugLog(argv);
  debugLog({
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    handle: handle?.toString(),
    // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
    message: message?.toString(),
  });

  for (const folder of findFlowDir()) {
    try {
      debugLog(folder);
      await execa(argv[0], argv.slice(1), {
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
