// @flow

import commander from 'commander';
import chalk from 'chalk';
import { areEqual } from 'fbjs';

import { version } from '../../package.json';

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {Array} - cli options
 */
export default (
  argv: $ReadOnlyArray<string>,
): Promise<$ReadOnlyArray<string>> =>
  new Promise(resolve => {
    const program = new commander.Command('nested-flow')
      .version(version, '-v, --version')
      .arguments('[commands...]')
      .usage(chalk`{green [commands...]}`)
      .description(
        chalk`Example:
  nested-flow
  nested-flow {green flow-typed install}`,
      )
      .allowUnknownOption()
      .action(
        (_: mixed, { rawArgs }: {| rawArgs: $ReadOnlyArray<string> |}) => {
          resolve(['flow', ...rawArgs.slice(2)]);
        },
      );

    program
      .command('flow-typed')
      .arguments('[commands...]')
      .usage(chalk`{green [commands...]}`)
      .description('you can use ecah command in the flow-typed')
      .allowUnknownOption()
      .action(
        (
          _: mixed,
          {
            parent: { rawArgs },
          }: {| parent: {| rawArgs: $ReadOnlyArray<string> |} |},
        ) => {
          resolve(rawArgs.slice(2));
        },
      );

    if (argv.length === 2) resolve(['flow']);
    else program.parse([...argv]);
  }).then((prevArgv: $ReadOnlyArray<string>) =>
    areEqual(prevArgv, ['flow']) ? ['flow', '--show-all-errors'] : prevArgv,
  );
