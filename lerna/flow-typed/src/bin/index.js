#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import link from 'utils/link';
import flowTypedCache from 'utils/flowTypedCache';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      {|
        help: () => void,
      |},
    ]
  | ['cache' | 'link', {| restore?: boolean, remove?: boolean |}],
>({
  name: 'lerna-flow-typed',
  version,
  description: chalk`Handle the all {green flow-typed} folders in the monorepo.`,
  commands: {
    link: {
      description: chalk`Link {green .flowconfig} in the each package.`,
      options: [
        {
          flags: '--remove',
          description: chalk`Remove linked {green .flowconfig} in the each pacakge`,
        },
      ],
    },
    cache: {
      description: chalk`Store the all {green flow-typed} folders to the cache directory.`,
      options: [
        {
          flags: '--restore',
          description: chalk`Restore the all {green flow-typed} folders from the cache directory.`,
        },
      ],
    },
  },
});

(async () => {
  const result = await parseArgv(process.argv);

  if (result.length === 2) {
    if (result[0] === 'link') await link(Boolean(result[1].remove));
    else await flowTypedCache(Boolean(result[1].restore));
    return;
  }

  result[0].help();
})();
