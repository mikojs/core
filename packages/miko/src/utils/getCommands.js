// @flow

import getCommandsArray from './getCommandsArray';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @example
 * getCommands('yarn install')
 *
 * @param {any} command - command string or command function
 * @param {object} configs - miko configs
 *
 * @return {commandsType} - commands array
 *
 */
const getCommands = (
  command: string | (() => commandsType),
  configs: {},
): commandsType =>
  (typeof command === 'string' ? getCommandsArray(command) : command()).reduce(
    (
      result: commandsType,
      commands: $ElementType<commandsType, number>,
    ): commandsType => {
      const mikoCommandIndex = commands.findIndex(
        (key: string, index: number) =>
          index !== 0 && commands[index - 1] === 'miko',
      );

      if (mikoCommandIndex !== -1) {
        const mikoCommand = [
          ...getCommands(configs[commands[mikoCommandIndex]].command, configs),
        ];

        mikoCommand[0] = [
          ...commands.slice(0, mikoCommandIndex - 1),
          ...mikoCommand[0],
        ];
        mikoCommand[mikoCommand.length - 1] = [
          ...mikoCommand[mikoCommand.length - 1],
          ...commands.slice(mikoCommandIndex + 1),
        ];

        return [...result, ...mikoCommand];
      }

      return [...result, commands];
    },
    [],
  );

export default getCommands;
