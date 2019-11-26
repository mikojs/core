#! /usr/bin/env node
// @flow

import path from 'path';

import execa from 'execa';

import cliOptions from 'utils/cliOptions';
import findFlowConfigs from 'utils/findFlowConfigs';

(async () => {
  const argv = await cliOptions(process.argv);

  await Promise.all(
    findFlowConfigs().map((filePath: string) =>
      execa(argv[0], argv.slice(1), {
        cwd: path.dirname(filePath),
      }),
    ),
  );
})();
