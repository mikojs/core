#! /usr/bin/env node
// @flow

import ora from 'ora';
import debug from 'debug';
import chalk from 'chalk';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

import cache from 'utils/cache';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const debugLog = debug('miko:bin');
const option = {
  name: 'miko',
  version,
  description: chalk`{cyan manage configs} and {cyan run commands} with the {green miko} worker`,
  args: '<commands...>',
  allowUnknownOption: true,
  commands: {
    generate: {
      description: 'generate configs',
      options: [
        {
          flags: '-k, --keep',
          description: 'use to keep server working, not auto close',
        },
      ],
    },
    kill: {
      description: chalk`kill the all events of the {green miko} worker`,
    },
  },
};
const existCommands = Object.keys(option.commands);
const configs = cache.get('miko').config?.({}) || {};

handleUnhandledRejection();
Object.keys(configs)
  .filter((key: string) => !existCommands.includes(key))
  .forEach((key: string) => {
    option.commands[key] = {
      description: chalk`{gray (custom)} ${configs[key].description}`,
      allowUnknownOption: true,
    };
  });

(async () => {
  const result = await commander(option)(process.argv);

  debugLog(result);
  logger.start('Running');
})();
