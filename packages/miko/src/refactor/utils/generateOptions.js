// @flow

import chalk from 'chalk';

import { type optionsType, type defaultOptionsType } from '@mikojs/commander';

import { version } from '../../../package.json';

type commandsOptionsType = {| [string]: defaultOptionsType<> |};

/**
 * @param {commandsOptionsType} commands - prev custom commands
 *
 * @return {commandsOptionsType} - new custom commands
 */
const addAllowUnknownOption = (
  commands: commandsOptionsType,
): commandsOptionsType =>
  Object.keys(commands).reduce(
    (result: commandsOptionsType, key: string) => ({
      ...result,
      [key]: {
        ...commands[key],
        allowUnknownOption: true,
      },
    }),
    {},
  );

/**
 * @param {commandsOptionsType} commands - custom commands
 *
 * @return {optionsType} - commander options
 */
export default (commands: commandsOptionsType): optionsType<> => ({
  name: 'miko',
  version,
  description: chalk`{cyan Generate configs} in the cache folder and run the {green command} with the keyword.`,
  args: '<commands...>',
  allowUnknownOption: true,
  commands: addAllowUnknownOption(commands),
});
