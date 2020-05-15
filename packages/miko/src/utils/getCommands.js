// @flow

import getCommandsArray, {
  QUOTATION_START,
  QUOTATION_END,
} from './getCommandsArray';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @param {string} command - command string or command function
 * @param {object} configs - miko configs
 * @param {Array} otherArgs - other arguments
 *
 * @return {commandsType} - commands array
 */
const getCommands = (
  command: string | (() => string),
  configs: {},
  otherArgs: $ReadOnlyArray<string>,
): commandsType =>
  getCommandsArray(typeof command === 'string' ? command : command()).reduce(
    (
      result: commandsType,
      commands: $ElementType<commandsType, number>,
      index: number,
      commandsArray: commandsType,
    ): commandsType => {
      const currentCommands = (commandsArray.length - 1 !== index
        ? commands
        : [...commands, ...otherArgs]
      ).map((currentCommand: string) =>
        QUOTATION_START.test(currentCommand) &&
        QUOTATION_END.test(currentCommand) &&
        /miko/.test(currentCommand)
          ? currentCommand.replace(
              /miko (\w+)/g,
              (match: string, key: string) =>
                getCommands(configs[key].command, configs, [])
                  .map((eachCommands: $ReadOnlyArray<string>) =>
                    eachCommands.join(' '),
                  )
                  .join(' && '),
            )
          : currentCommand,
      );
      const mikoCommandIndex = currentCommands.findIndex(
        (currentCommand: string, currentCommandIndex: number) =>
          currentCommandIndex !== 0 &&
          currentCommands[currentCommandIndex - 1] === 'miko',
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
