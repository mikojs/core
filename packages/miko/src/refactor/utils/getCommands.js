// @flow

import crypto from 'crypto';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @param {commandsType} commands - commands array
 *
 * @return {string} - command string
 */
const getCommandStr = (commands: commandsType) =>
  commands.map((str: $ReadOnlyArray<string>) => str.join(' ')).join(' && ');

/**
 * @param {string} commandStr - command string
 *
 * @return {commandsType} - commands array
 */
const getCommands = (commandStr: string): commandsType => {
  const [patternStr, patternCommand] = commandStr.match(/["'](.+)['"]/) || [];
  const hash = !patternStr
    ? ''
    : crypto.createHash('md5').update(patternStr).digest('hex');

  return (!patternStr ? commandStr : commandStr.replace(patternStr, hash))
    .split(/[ ]*&&[ ]*/)
    .map((str: string) =>
      str
        .split(/[ ]+/)
        .map((subStr: string) =>
          subStr !== hash
            ? subStr
            : patternStr.replace(
                patternCommand,
                getCommandStr(getCommands(patternCommand)),
              ),
        ),
    );
};

export default getCommands;
