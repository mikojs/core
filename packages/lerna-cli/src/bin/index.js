#! /usr/bin/env node
// @flow

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

handleUnhandledRejection();

const parseArgv = commander<[]>({
  name: 'lerna-cli',
  version,
  description: 'Additional lerna commands for the monorepo.',
});

(async () => {
  await parseArgv(process.argv);
})();
