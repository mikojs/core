#! /usr/bin/env node
// @flow

import path from 'path';

import chalk from 'chalk';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import link from 'utils/link';
import remove from 'utils/remove';
import store from 'utils/store';

handleUnhandledRejection();

const parseArgv = commander<
  | [
      | {
          help: () => void,
        }
      | 'store'
      | 'restore'
      | 'remove',
    ]
  | ['link', ?string],
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
    store: {
      description: chalk`Store the all {green flow-typed} folders to the cache directory.`,
    },
    restore: {
      description: chalk`Restore the all {green flow-typed} folders from the cache directory.`,
    },
  },
});

(async () => {
  const result = await parseArgv(process.argv);

  switch (result[0]) {
    case 'link':
      if (result.length === 1) return;

      await link(path.resolve(result[1] || '.flowconfig'));
      break;

    case 'remove':
      await remove();
      break;

    case 'store':
      await store();
      break;

    case 'restore':
      await store(true);
      break;

    default:
      result[0].help();
      break;
  }
})();
