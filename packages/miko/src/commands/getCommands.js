// @flow

import normalize, {
  type commandsType,
  QUOTATION_START,
  QUOTATION_END,
} from './normalize';

import { type mikoConfigsType } from 'utils/addCustomCommands';

/**
 * @param {mikoConfigsType} configs - miko configs
 * @param {string} key - command key
 * @param {Array} args - other arguments
 *
 * @return {commandsType} - commands array
 */
const getCommands = (
  configs: mikoConfigsType,
  key: string,
  args: $ReadOnlyArray<string>,
): commandsType =>
  normalize(
    typeof configs[key].command === 'string'
      ? configs[key].command
      : configs[key].command(),
  ).reduce(
    (
      result: commandsType,
      commands: $ElementType<commandsType, number>,
      index: number,
      commandsArray: commandsType,
    ): commandsType => {
      const currentCommands = (commandsArray.length - 1 !== index
        ? commands
        : [...commands, ...args]
      ).map((currentCommand: string) =>
        QUOTATION_START.test(currentCommand) &&
        QUOTATION_END.test(currentCommand) &&
        /miko/.test(currentCommand)
          ? currentCommand.replace(
              /miko (\w+)/g,
              (match: string, commandKey: string) =>
                getCommands(configs, commandKey, [])
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
          ...getCommands(configs, currentCommands[mikoCommandIndex], []),
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
