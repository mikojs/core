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

  return (!patternStr ? commandStr : commandStr.replace(patternStr, hash))
    .split(/[ ]*&&[ ]*/)
    .reduce(
      async (
        result: Promise<commandsType>,
        str: string,
      ): Promise<commandsType> => {
        const prevResult = await result;
        const commands = str.split(/[ ]+/);

        if (!/^miko/.test(str))
          return [
            ...prevResult,
            await Promise.all(
              commands.map(async (subStr: string) =>
                subStr !== hash
                  ? subStr
                  : patternStr.replace(
                      patternCommand,
                      getCommandStr(
                        await getCommands(patternCommand, parseArgv),
                      ),
                    ),
              ),
            ),
          ];

        const [, { miko }] = await parseArgv(['node', ...commands]);

        return [...prevResult, ...(await getCommands(miko.command, parseArgv))];
      },
      Promise.resolve([]),
    );
};

export default getCommands;
