// @flow

import chalk from 'chalk';

import { type optionsType, type defaultOptionsType } from '@mikojs/commander';

import { version } from '../../../package.json';

type commandsType = {| [string]: defaultOptionsType<> |};

/**
 * @param {commandsType} commands - prev custom commands
 *
 * @return {commandsType} - new custom commands
 */
const addAllowUnknownOption = (commands: commandsType): commandsType =>
  Object.keys(commands).reduce(
    (result: commandsType, key: string) => ({
      ...result,
      [key]: {
        ...commands[key],
        allowUnknownOption: true,
      },
    }),
    {},
  );

/**
 * @param {commandsType} commands - custom commands
 *
 * @return {optionsType} - commander options
 */
export default (commands: commandsType): optionsType<> => ({
  name: 'miko',
  version,
  description: chalk`{cyan Generate configs} in the cache folder and run the {green command} with the keyword.`,
  args: '<commands...>',
  allowUnknownOption: true,
  commands: addAllowUnknownOption(commands),
});
