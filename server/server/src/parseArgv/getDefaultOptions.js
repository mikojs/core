// @flow

import chalk from 'chalk';

import { type optionsType } from '@mikojs/commander';

type defaultCommandType = $ElementType<
  $NonMaybeType<$PropertyType<optionsType, 'commands'>>,
  string,
>;

export type defaultOptionsType = {|
  ...$Diff<optionsType, {| version: mixed |}>,
  commands: {|
    ...$NonMaybeType<$PropertyType<optionsType, 'commands'>>,
    dev: defaultCommandType,
    start: defaultCommandType,
    build: defaultCommandType,
  |},
|};

/**
 * @param {string} name - command name
 *
 * @return {defaultOptionsType} - default options
 */
export default (name: string): defaultOptionsType => {
  const defaultCommand = {
    args: '<source-path>',
    options: [
      {
        flags: '-p, --port <port>',
        description: chalk`Set the port of the {green ${name}} server.`,
      },
      {
        flags: '--prefix <prefix>',
        description: chalk`Set the prefix of the {green ${name}} server.`,
      },
    ],
  };

  return {
    name,
    description: chalk`Use to control the {green ${name}} server.`,
    commands: {
      dev: {
        ...defaultCommand,
        description: chalk`Start the {green ${name}} server in the {cyan development} mode.`,
      },
      start: {
        ...defaultCommand,
        description: chalk`Start the {green ${name}} server in the {cyan production} mode.`,
      },
      build: {
        ...defaultCommand,
        description: chalk`Build the {cyan production} {green ${name}} server.`,
      },
    },
  };
};
