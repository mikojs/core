#! /usr/bin/env node
// flow

import path from 'path';

import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';

import cliOptions from 'utils/cliOptions';
import findFlowConfig from 'utils/findFlowConfig';

handleUnhandledRejection();

(async () => {
  cliOptions(process.argv);
  /*
  const result = await Promise.all(
    findFlowConfig()
      .map((filePath: string) => execa('ls', ['-al'], {
        cwd: path.dirname(filePath),
      }))
  );
  */
})();
