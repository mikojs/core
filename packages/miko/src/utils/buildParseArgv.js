// @flow

import chalk from 'chalk';

import commander, { type parseArgvType } from '@mikojs/commander';

import { version } from '../../package.json';
import cache from './cache';

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

/**
 * @return {Promise} - parse result
 */
export default <Data: $ReadOnlyArray<mixed>>(): parseArgvType<Data> => {
  const existCommands = Object.keys(option.commands);
  const configs = cache.get('miko').config?.({}) || {};

  Object.keys(configs)
    .filter((key: string) => !existCommands.includes(key))
    .forEach((key: string) => {
      option.commands[key] = {
        description: chalk`{gray (custom)} ${configs[key].description}`,
        allowUnknownOption: true,
      };
    });

  return commander(option);
};
