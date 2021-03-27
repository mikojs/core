// @flow

import chalk from 'chalk';

import commander from '@mikojs/commander';

import { version } from '../../package.json';
import addCustomCommands, { type mikoConfigsType } from './addCustomCommands';

type parsedResultType = [
  string,
  {| keep?: boolean |},
  $ReadOnlyArray<string> | void,
];

const defaultOptions = {
  description: chalk`{cyan Manage configs} and {cyan run commands} with the {green miko} worker.`,
  args: '<commands...>',
  allowUnknownOption: true,
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
