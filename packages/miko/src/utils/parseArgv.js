// @flow

import chalk from 'chalk';

import commander, { type defaultOptionsType } from '@mikojs/commander';

import { version } from '../../package.json';

export type mikoConfigsType = {|
  [string]: {|
    command: string | (() => string),
    description: string,
    commands?: mikoConfigsType,
  |},
|};

type parsedResultType = [
  'generate' | 'kill' | string,
  {| keep?: boolean |},
  $ReadOnlyArray<string> | void,
];

const defaultOptions = {
  description: chalk`{cyan Manage configs} and {cyan run commands} with the {green miko} worker.`,
  args: '<commands...>',
  allowUnknownOption: true,
  commands: {
    generate: {
      description: 'Generate the configs.',
      options: [
        {
          flags: '-k, --keep',
          description:
            'Keep server working, and make it would not be auto closed.',
        },
      ],
    },
    kill: {
      description: chalk`Kill the all events of the {green miko} worker.`,
    },
  },
};

/**
 * @param {defaultOptionsType} options - prev commander options
 * @param {mikoConfigsType} configs - current miko configs
 *
 * @return {defaultOptionsType} - new commander options
 */
const addCustomCommands = (
  options: defaultOptionsType,
  configs: mikoConfigsType,
): defaultOptionsType => {
  const commands = options.commands || {};
  const existCommands = Object.keys(commands);

  Object.keys(configs).forEach((key: string) => {
    if (existCommands.includes(key)) return;

    commands[key] = addCustomCommands(
      {
        description: chalk`{gray (custom)} ${configs[key].description}`,
        allowUnknownOption: true,
      },
      configs[key]?.commands || {},
    );
  });

  return {
    ...options,
    commands,
  };
};

/**
 * @param {mikoConfigsType} configs - miko configs
 * @param {Array} argv - command argv
 *
 * @return {parsedResultType} - parsed result
 */
export default (
  configs: mikoConfigsType,
  argv: $ReadOnlyArray<string>,
): Promise<parsedResultType> =>
  commander<parsedResultType>({
    ...addCustomCommands(defaultOptions, configs),
    name: 'miko',
    version,
  })(argv);
