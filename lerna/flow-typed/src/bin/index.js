#! /usr/bin/env node
// @flow

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import store from 'utils/store';

handleUnhandledRejection();

const parseArgv = commander<
  [
    | {
        help: () => void,
      }
    | 'store'
    | 'restore',
  ],
>({
  name: 'lerna-flow-typed',
  version,
  description: chalk`Handle the all {green flow-typed} folders in the monorepo.`,
  commands: {
    store: {
      description: chalk`Store the all {green flow-typed} folders to the cache directory.`,
    },
    restore: {
      description: chalk`Restore the all {green flow-typed} folders from the cache directory.`,
    },
  },
});

(async () => {
  const [type] = await parseArgv(process.argv);

  switch (type) {
    case 'store':
      await store();
      break;

    case 'restore':
      await store(true);
      break;

    default:
      type.help();
      break;
  }
})();
