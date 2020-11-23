// @flow

import chalk from 'chalk';

import commander from '@mikojs/commander';

import { version } from '../../package.json';

export type mikoConfigsType = {|
  [string]: {|
    command: string | (() => string),
    description: string,
  |},
|};

type parseResultType = [
  'generate' | 'kill' | string,
  {| keep?: boolean |},
  $ReadOnlyArray<string> | void,
];

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
 * @param {mikoConfigsType} configs - miko configs
 * @param {Array} argv - command argv
 *
 * @return {Promise} - parse result
 */
export default (
  configs: {},
  argv: $ReadOnlyArray<string>,
): Promise<parseResultType> => {
  const existCommands = Object.keys(option.commands);

  Object.keys(configs)
    .filter((key: string) => !existCommands.includes(key))
    .forEach((key: string) => {
      option.commands[key] = {
        description: chalk`{gray (custom)} ${configs[key].description}`,
        allowUnknownOption: true,
      };
    });

  return commander<parseResultType>(option)(argv);
};
