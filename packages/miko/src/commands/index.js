// @flow

import execa from 'execa';

import createLogger from '@mikojs/logger';

import { type commandsType } from './normalize';
import getCommands from './getCommands';
import getExecaOptions from './getExecaOptions';

import { type mikoConfigsType } from 'utils/parseArgv';

type commandType = {|
  info: string,
  run: () => $Call<typeof execa>,
|};

const logger = createLogger('@mikojs/miko:commands');

/**
 * @param {mikoConfigsType} configs - miko configs
 * @param {string} key - command key
 * @param {Array} args - other arguments
 *
 * @return {commandType} - command object
 */
export default (
  configs: mikoConfigsType,
  key: string | commandsType,
  args: $ReadOnlyArray<string>,
): commandType => {
  const commands = key instanceof Array ? key : getCommands(configs, key, args);

  logger.debug(commands);

  return {
    info: commands
      .map((command: $ElementType<commandsType, number>) =>
        command.join(' ').replace(/\n/, ''),
      )
      .join(' && '),

    /**
     * @return {Function} - execa result
     */
    run: () =>
      commands.reduce(
        (result: Promise<void>, command: $ElementType<commandsType, number>) =>
          result.then(() => execa(...getExecaOptions(command))),
        Promise.resolve(),
      ),
  };
};
