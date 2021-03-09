// @flow

import crypto from 'crypto';

import { type parseArgvType } from './getParseArgv';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string>>;

/**
 * @param {commandsType} commands - commands array
 *
 * @return {string} - command string
 */
const getCommandStr = (commands: commandsType) =>
  commands.map((str: $ReadOnlyArray<string>) => str.join(' ')).join(' && ');

/**
 * @param {Array} commands - prev commands array
 * @param {parseArgvType} parseArgv - parse argv
 *
 * @return {Array} - new commands array
 */
const handleMikoCommand = async (
  commands: $ReadOnlyArray<string>,
  parseArgv: parseArgvType,
) => (commands[0] !== 'miko' ? commands : await parseArgv(commands));

/**
 * @param {string} commandStr - command string
 * @param {parseArgvType} parseArgv - parse argv
 *
 * @return {commandsType} - commands array
 */
const getCommands = (
  commandStr: string,
  parseArgv: parseArgvType,
): Promise<commandsType> => {
  const [patternStr, patternCommand] = commandStr.match(/["'](.+)['"]/) || [];
  const hash = !patternStr
    ? ''
    : crypto.createHash('md5').update(patternStr).digest('hex');

  return Promise.all(
    (!patternStr ? commandStr : commandStr.replace(patternStr, hash))
      .split(/[ ]*&&[ ]*/)
      .map(async (str: string) =>
        Promise.all(
          (
            await handleMikoCommand(str.split(/[ ]+/), parseArgv)
          ).map(async (subStr: string) =>
            subStr !== hash
              ? subStr
              : patternStr.replace(
                  patternCommand,
                  getCommandStr(await getCommands(patternCommand, parseArgv)),
                ),
          ),
        ),
      ),
  );
};

export default getCommands;
