// @flow

import crypto from 'crypto';

import { type parseArgvType, type parsedResultType } from './getParseArgv';

export type commandsType = $ReadOnlyArray<$ReadOnlyArray<string | {| [string]: string |}>>;

type configFilesType = {| [string]: string |};

/**
 * @param {commandsType} commands - commands array
 *
 * @return {string} - command string
 */
const getCommandStr = (commands: commandsType) =>
  commands.map((command: $ElementType<commandsType, number>) => command
    .map(
      (key: $ElementType<$ElementType<commandsType, number>, number>) => {
        if (typeof key === 'string')
          return key;

        const [[commandKey, commandValue]] = Object.entries(key);

        return `${commandKey}=${commandValue}`;
      },
    ).join(' ')
  ).join(' && ');

/**
 * @param {string} commandStr - command string
 * @param {configFilesType} configFiles - config files
 * @param {parseArgvType} parseArgv - parse argv
 *
 * @return {commandsType} - commands array
 */
const getCommands = (
  commandStr: string,
  configFiles: configFilesType,
  parseArgv: parseArgvType,
): Promise<commandsType> => {
  const [patternStr, patternCommand] = commandStr.match(/["'](.+)['"]/) || [];
  const hash = !patternStr
    ? ''
    : crypto.createHash('md5').update(patternStr).digest('hex');

  return (!patternStr ? commandStr : commandStr.replace(patternStr, hash))
    .replace(
      /{{ configs\.([\w]+) }}/,
      (str: string, p1: string) => configFiles[p1],
    )
    .split(/[ ]*&&[ ]*/)
    .reduce(
      async (
        result: Promise<commandsType>,
        str: string,
      ): Promise<commandsType> => {
        const prevResult = await result;
        const commands = str.split(/[ ]+/);

        if (!/^miko/.test(str.replace(/[^ ]+=[^ ]+[ ]/, '')))
          return [
            ...prevResult,
            await commands.reduce(
              async (
                subResultPromise: Promise<$ElementType<commandsType, number>>,
                subStr: string,
              ): Promise<$ElementType<commandsType, number>> => {
                const subResult = await subResultPromise;
                const [lastStr] = subResult.slice(-1);

                if (typeof lastStr !== 'string' && /=/.test(subStr)) {
                  const [key, value] = subStr.split(/=/);

                  return [
                    ...subResult,
                    {
                      ...lastStr,
                      [key]: value,
                    },
                  ];
                }

                return [
                  ...subResult,
                  subStr !== hash
                    ? subStr
                    : patternStr.replace(
                        patternCommand,
                        getCommandStr(
                          await getCommands(
                            patternCommand,
                            configFiles,
                            parseArgv,
                          ),
                        ),
                      ),
                ];
              },
              Promise.resolve([]),
            ),
          ];

        const command = (await parseArgv(['node', ...commands])).reduce(
          (
            subResult: string,
            data: $ElementType<parsedResultType, number>,
          ): string => {
            if (typeof data === 'string') return subResult;

            if (data instanceof Array)
              return [subResult, ...data].filter(Boolean).join(' ');

            return [
              subResult,
              typeof data.miko.command === 'string'
                ? data.miko.command
                : data.miko.command(),
            ].join('');
          },
          '',
        );

        return [
          ...prevResult,
          ...(await getCommands(
            !patternStr ? command : command.replace(hash, patternStr),
            configFiles,
            parseArgv,
          )),
        ];
      },
      Promise.resolve([]),
    );
};

export default getCommands;
