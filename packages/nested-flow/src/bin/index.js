#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowDir from 'utils/findFlowDir';

handleUnhandledRejection();

(async () => {
  const { log } = console;
  const argv = await cliOptions(process.argv);
  let countError: number = 0;

  for (const folder of findFlowDir()) {
    try {
      await execa(argv[0], argv.slice(1), {
        cwd: folder,
      });
    } catch (e) {
      log(
        e.stdout
          .replace(
            /Error ([-]+) /g,
            `Error $1 ${path.relative(process.cwd(), folder)}`,
          )
          .replace(/\n\nFound [0-9]+ errors\n/g, '')
          .replace(
            /\n\n... [0-9]+ more errors \(only [0-9]+ out of [0-9]+ errors displayed\)\n/g,
            '',
          )
          .replace(
            /To see all errors, re-run Flow with --show-all-errors\n/g,
            '',
          ),
      );

      countError += (e.stdout.match(/Error ([-]+) /g) || []).length;
    }
  }

  log(`
Found ${countError} errors
`);
})();
