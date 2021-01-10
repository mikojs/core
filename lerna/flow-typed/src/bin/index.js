#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import link from 'utils/link';
import remove from 'utils/remove';
import flowTypedCache from 'utils/flowTypedCache';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      {|
        help: () => void,
      |},
    ]
  | ['link', ?string, {}]
  | ['remove', {}]
  | ['cache', {| restore?: boolean |}],
>({
  name: 'lerna-flow-typed',
  version,
  description: chalk`Handle the all {green flow-typed} folders in the monorepo.`,
  commands: {
    link: {
      description: chalk`Link {green .flowconfig} in the each package.`,
      args: '[flowconfig]',
    },
    remove: {
      description: chalk`Remove linked {green .flowconfig} in the each pacakge`,
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

  if (result.length === 1) {
    result[0].help();
    return;
  }

  switch (result[0]) {
    case 'cache':
      if (result[1] instanceof Object)
        await flowTypedCache(Boolean(result[1].restore));
      break;

    case 'link':
      if (!result[1] || typeof result[1] === 'string')
        await link(path.resolve(result[1] || '.flowconfig'));
      break;

    case 'remove':
      await remove();
      break;

    default:
      break;
  }
})();
