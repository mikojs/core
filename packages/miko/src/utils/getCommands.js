// @flow

import getCommandsArray from './getCommandsArray';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @example
 * getCommands('yarn install')
 *
 * @param {any} command - command string or command function
 * @param {object} configs - miko configs
 * @param {Array} otherArgs - other arguments
 *
 * @return {commandsType} - commands array
 *
 */
const getCommands = (
  command: string | (() => commandsType),
  configs: {},
  otherArgs: $ReadOnlyArray<string>,
): commandsType =>
  (typeof command === 'string' ? getCommandsArray(command) : command()).reduce(
    (
      result: commandsType,
      commands: $ElementType<commandsType, number>,
      index: number,
      commandsArray: commandsType,
    ): commandsType => {
      const currentCommands =
        commandsArray.length - 1 !== index
          ? commands
          : [...commands, ...otherArgs];
      const mikoCommandIndex = currentCommands.findIndex(
        (key: string, currentCommandIndex: number) =>
          index !== 0 && currentCommands[currentCommandIndex - 1] === 'miko',
      );

      if (mikoCommandIndex !== -1) {
        const mikoCommand = [
          ...getCommands(
            configs[currentCommands[mikoCommandIndex]].command,
            configs,
            [],
          ),
        ];

        mikoCommand[0] = [
          ...currentCommands.slice(0, mikoCommandIndex - 1),
          ...mikoCommand[0],
        ];
        mikoCommand[mikoCommand.length - 1] = [
          ...mikoCommand[mikoCommand.length - 1],
          ...currentCommands.slice(mikoCommandIndex + 1),
        ];

        return [...result, ...mikoCommand];
      }

      return [...result, currentCommands];
    },
    [],
  );

export default getCommands;
