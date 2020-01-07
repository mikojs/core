#! /usr/bin/env node
// @flow

import { cosmiconfigSync } from 'cosmiconfig';
import npmWhich from 'npm-which';
import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';

handleUnhandledRejection();

(async () => {
  const config = cosmiconfigSync('exec').search()?.config || {};
  const [type, ...argv] = process.argv.slice(2);
  const commands = [
    ...(config[type] || [npmWhich(process.cwd()).sync(type)]),
    ...argv,
  ];

  await execa(commands[0], commands.slice(1), {
    stdio: 'inherit',
  });
})();
