// @flow

import { type commandsType } from './getCommands';
import { QUOTATION_START, QUOTATION_END } from './getCommandsArray';

type resultType = [
  string,
  $ElementType<commandsType, number>,
  { stdio: 'inherit', env: { [string]: string } },
];

/**
 * @example
 * getExecaArguments(['echo', 'test'])
 *
 * @param {Array} commands - commands array
 *
 * @return {resultType} - execa arguments
 */
export default (commands: $ElementType<commandsType, number>): resultType => {
  let hasEnv: boolean = true;

  return commands.reduce(
    (result: resultType, command: string): resultType => {
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
