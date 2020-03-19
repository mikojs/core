// @flow

import commander from 'commander';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

import { version } from '../../package.json';

export type optionsType =
  | false
  | {|
      keyword: string,
      filteredArgv: $ReadOnlyArray<string>,
    |};

const logger = createLogger('@mikojs/miko');

/**
 * @example
 * cliOptions([])
 *
 * @param {Array} argv - command line
 *
 * @return {Array<string>} - cli options
 */
export default (argv: $ReadOnlyArray<string>): optionsType => {
  const {
    args: [keyword],
    rawArgs,
  } = new commander.Command('miko')
    .version(version, '-v, --version')
    .arguments('<keyword> [...options]')
    .usage(chalk`{green <keyword> [...options]}`)
    .description(
      chalk`Example:
  miko {green key-a}
  miko {green key-a --option-a}`,
    )
    .parse([...argv]);

  if (!keyword) {
    logger
      .fail(chalk`Should give a keyword at least`)
      .fail(chalk`Use {green \`--help\`} to get the more information`);
    return false;
  }

  return {
    keyword,
    filteredArgv: rawArgs.slice(2).filter((key: string) => key !== keyword),
  };
};
