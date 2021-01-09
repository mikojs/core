// @flow

import { type commandsType, QUOTATION_START, QUOTATION_END } from './normalize';

type execaOptionsType = [
  string,
  $ElementType<commandsType, number>,
  { stdio: 'inherit', env: { [string]: string } },
];

/**
 * @param {Array} commands - commands array
 *
 * @return {execaOptionsType} - execa options
 */
export default (
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
