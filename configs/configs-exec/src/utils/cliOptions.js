// @flow

import commander from 'commander';
import chalk from 'chalk';
import npmWhich from 'npm-which';
import { cosmiconfigSync } from 'cosmiconfig';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

import getCommands from './getCommands';
import printInfo from './printInfo';

type optionType = boolean | $ReadOnlyArray<string>;

const logger = createLogger('@mikojs/configs (exec)');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {optionType} - cli options
 */
export default async (argv: $ReadOnlyArray<string>): Promise<optionType> =>
  new Promise((resolve, reject) => {
    const config = cosmiconfigSync('exec').search()?.config || {};
    const program = new commander.Command('configs-exec')
      .version(version, '-v, --version')
      .arguments('<command-type> [commands...]')
      .usage(chalk`{green <command-type> [commands...]}`)
      .description(
        chalk`Example:
  configs-exec {green babel -w}
  configs-exec {cyan info}`,
      )
      .allowUnknownOption()
      .action(() => {
        resolve([
          ...(getCommands(argv[2].split(/:/), config) || [
            npmWhich(process.cwd()).sync(argv[2]),
          ]),
          ...argv.slice(3),
        ]);
      });

    program
      .command('info')
      .description('print more info about configs-exec')
      .action((cliName: ?string) => {
        const { log } = console;

        logger.info('Here are the all commands which you can use:');
        log();
        printInfo(config);
        log();
        resolve(true);
      });

    if (argv.length === 2) resolve(false);
    else program.parse([...argv]);
  });
