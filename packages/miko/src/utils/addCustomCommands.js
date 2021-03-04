// @flow

import chalk from 'chalk';

import { type defaultOptionsType } from '@mikojs/commander';

export type mikoConfigsType = {|
  [string]: {|
    command: string | (() => string),
    description: string,
    commands?: mikoConfigsType,
  |},
|};

/**
 * @param {defaultOptionsType} options - prev commander options
 * @param {mikoConfigsType} configs - current miko configs
 *
 * @return {defaultOptionsType} - new commander options
 */
const addCustomCommands = (
  options: defaultOptionsType<>,
  configs: mikoConfigsType,
): defaultOptionsType<> => {
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

export default addCustomCommands;
