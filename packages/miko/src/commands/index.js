// @flow

import execa from 'execa';
import debug from 'debug';

import { type commandsType, QUOTATION_START, QUOTATION_END } from './normalize';
import getCommands from './getCommands';

import cache from 'utils/cache';

type commandType = {|
  info: string,
  run: () => $Call<typeof execa>,
|};

type execaOptionsType = [
  string,
  $ElementType<commandsType, number>,
  { stdio: 'inherit', env: { [string]: string } },
];

const debugLog = debug('miko:commands');

/**
 * @param {Array} commands - commands array
 *
 * @return {execaOptionsType} - execa options
 */
const transform = (
  commands: $ElementType<commandsType, number>,
): execaOptionsType => {
  let hasEnv: boolean = true;

  return commands.reduce(
    (result: execaOptionsType, command: string): execaOptionsType => {
      if (hasEnv && !/=/.test(command)) hasEnv = false;

      if (!hasEnv)
        return result[0] === ''
          ? [command, result[1], result[2]]
          : [
              result[0],
              [
                ...result[1],
                command.replace(QUOTATION_START, '').replace(QUOTATION_END, ''),
              ],
              result[2],
            ];

      const [key, value] = command.split(/=/);

      return [
        result[0],
        result[1],
        {
          ...result[2],
          env: {
            ...result[2].env,
            [key]: value,
          },
        },
      ];
    },
    ['', [], { stdio: 'inherit', env: {} }],
  );
};

/**
 * @param {string} key - command key
 * @param {Array} args - other arguments
 *
 * @return {commandType} - command object
 */
export default (
  key: string | commandsType,
  args: $ReadOnlyArray<string>,
): commandType => {
  const commands =
    key instanceof Array
      ? key
      : getCommands(cache.get('miko').config?.({}) || {}, key, args);

  debugLog(commands);

  return {
    info: commands
      .map((command: $ElementType<commandsType, number>) => command.join(' '))
      .join(' && '),

    /**
     * @return {Function} - execa result
     */
    run: () =>
      commands.reduce(
        (result: Promise<void>, command: $ElementType<commandsType, number>) =>
          result.then(() => execa(...transform(command))),
        Promise.resolve(),
      ),
  };
};