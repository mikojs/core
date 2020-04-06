// @flow

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';

import { version } from '../../package.json';

export type optionsType = {|
  type: 'start' | 'kill' | 'run',
  configNames?: $ReadOnlyArray<string>,
  keep?: boolean,
  commands?: $ReadOnlyArray<$ReadOnlyArray<string>>,
|};

const debugLog = debug('miko:getOptions');

/**
 * @example
 * getOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {optionsType} - options
 */
export default (argv: $ReadOnlyArray<string>): Promise<optionsType> =>
  new Promise((resolve, reject) => {
    const program = new commander.Command('miko')
      .version(version, '-v, --version')
      .arguments('[configNames...]')
      .description(
        chalk`Example:
  miko
  miko {gray --keep}
  miko {green babel}
  miko {green babel} {gray --keep}
  miko {cyan kill}
  miko {cyan run} {green babel src -d lib}`,
      )
      .option('--keep', 'use to keep server working, not auto close')
      .action(
        (
          configNames: $ReadOnlyArray<string>,
          { keep = false }: {| keep: boolean |},
        ) => {
          debugLog(configNames);
          resolve({ type: 'start', configNames, keep });
        },
      );

    program
      .command('kill')
      .description('kill the all events')
      .action(() => {
        resolve({ type: 'kill' });
      });

    program
      .command('run')
      .description('the helper to run the scripts in the package.json')
      .action((_: mixed, commands: $ReadOnlyArray<string>) => {
        let hasStarter: number = 0;

        resolve({
          type: 'run',
          commands: commands.map((command: string) =>
            command
              .split(/ /)
              .reduce(
                (
                  result: $ReadOnlyArray<string>,
                  key: string,
                ): $ReadOnlyArray<string> => {
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
              ),
          ),
        });
      });

    debugLog(argv);

    if (argv.length === 3 && argv.slice(-1)[0] === '--keep')
      resolve({ type: 'start', configNames: [], keep: true });
    else if (argv.length !== 2) program.parse([...argv]);
    else resolve({ type: 'start', configNames: [], keep: false });
  });
