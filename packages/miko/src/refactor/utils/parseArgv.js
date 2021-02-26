// @flow

import chalk from 'chalk';

import commander, { type defaultOptionsType } from '@mikojs/commander';

import { version } from '../../../package.json';

import {
  // $FlowFixMe FIXME: Owing to utils/configs use pipline
  type configsType as todoConfigsType,
} from './configs';

type configsType =
  // $FlowFixMe FIXME: Owing to utils/configs use pipline
  todoConfigsType;

// TODO
type parsedResultType = [];

const defaultOptions = {
  description: chalk`Run commands with auto generating {green configs}.`,
  args: '<commands...>',
  allowUnknownOption: true,
};

/**
 * @param {configsType} configs - miko configs
 * @param {defaultOptionsType} options - prev commander options
 *
 * @return {defaultOptionsType} - new commander options
 */
const addCommands = (
  configs: configsType,
  options?: defaultOptionsType = defaultOptions,
): defaultOptionsType => {
  const commands = options.commands || {};

  Object.keys(configs).forEach((key: string) => {
    commands[key] = addCommands(configs[key]?.commands || {}, {
      description: chalk`{gray (custom)} ${configs[key].description}`,
      allowUnknownOption: true,
    });
  });

  return {
    ...options,
    commands,
  };
};

/**
 * @param {configsType} configs - miko configs
 * @param {Array} argv - process.argv
 *
 * @return {parsedResultType} - parsed result
 */
export default (
  configs: configsType,
  argv: $ReadOnlyArray<string>,
): Promise<parsedResultType> =>
  commander<parsedResultType>({
    ...addCommands(configs),
    name: 'miko',
    version,
  })(argv);
