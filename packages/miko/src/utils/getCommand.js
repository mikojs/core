// @flow

import debug from 'debug';
import execa, { type ExecaPromise as execaPromiseType } from 'execa';

const debugLog = debug('miko:getCommand');

/**
 * @example
 * getCommandArray('babel src -d lib')
 *
 * @param {string} command - command string
 *
 * @return {Array} - command array
 */
const getCommandArray = (command: string): $ReadOnlyArray<string> => {
  let hasStarter: number = 0;

  return command
    .split(/ /)
    .reduce(
      (result: $ReadOnlyArray<string>, key: string): $ReadOnlyArray<string> => {
        if (hasStarter !== 0) {
          if (/['"]$/.test(key)) hasStarter -= 1;

          return [
            ...result.slice(0, -1),
            `${result[result.length - 1]} ${key}`,
          ];
        }

        if (/^['"]/.test(key) && !/['"]$/.test(key)) hasStarter += 1;

        return [...result, key];
      },
      [],
    );
};

/**
 * @example
 * getCommand(['babel src -d lib $1', 'echo "-w"'])
 *
 * @param {Array} commands - originial commands
 *
 * @return {Array} - real command which will be used
 */
export default async (
  commands: $ReadOnlyArray<string>,
): Promise<$ReadOnlyArray<string>> => {
  debugLog(commands);

  const commandsArray = commands.map(getCommandArray);

  debugLog(commandsArray);

  const commandArguments = await Promise.all(
    commandsArray.slice(1).map((command: $ReadOnlyArray<string>) =>
      command[0] === ''
        ? ''
        : execa(command[0], command.slice(1))
            .then(({ stdout }: execaPromiseType) =>
              stdout.replace(/^['"]/, '').replace(/['"]$/, ''),
            )
            .then((stdout: string) =>
              command[0] !== 'yarn' ? stdout : stdout.replace(/^.*\$.*\n/, ''),
            ),
    ),
  );

  debugLog(commandArguments);

  return commandsArray[0].reduce(
    (result: $ReadOnlyArray<string>, command: string) => [
      ...result,
      ...getCommandArray(
        command.replace(
          /\$([\d])+/g,
          (_: string, indexString: string) =>
            commandArguments[parseInt(indexString, 10) - 1],
        ),
      ),
    ],
    [],
  );
};
