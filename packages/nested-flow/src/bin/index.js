#! /usr/bin/env node
// @flow

import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

import flowMessage from 'message/flow';

handleUnhandledRejection();

(async () => {
  const argv = await cliOptions(process.argv);
  const { message, end } =
    [flowMessage()].find(({ keys }: { keys: $ReadOnlyArray<string> }) =>
      keys.every((key: string) => argv.includes(key)),
    ) || {};

  for (const folder of findFlowDir()) {
    try {
      await execa(argv[0], argv.slice(1), {
        cwd: folder,
      });
    } catch (e) {
      // FIXME
      // eslint-disable-next-line flowtype/no-unused-expressions
      message?.(e.stdout, folder);
    }
  }

  // FIXME
  // eslint-disable-next-line flowtype/no-unused-expressions
  end?.();
})();
