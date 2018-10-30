// @flow

import commander from 'commander';
import debug from 'debug';
import chalk from 'chalk';

import { version } from '../../../package.json';

import logger from 'utils/logger';

const debugLog = debug('helper:cliOptions');

const program = new commander.Command('helper')
  .version(version, '-v, --version')
  .arguments('<commands>')
  .usage(chalk`{green <commands>} {gray [options]}`)
  .description(
    chalk`Example:
  helper {green 'babel -w'}
  helper {green 'babel -w'} {gray -r root}`,
  )
  .option('-p, --production', 'use production mode')
  .option(
    '-r, --root <root folder>',
    'the root folder of project. Default: src',
  );

const {
  root = 'src',
  production = false,
  args: [args],
} = program.parse(process.argv);

debugLog({
  root,
  production,
  args,
});

if (!args)
  logger.fail(
    chalk`Should give an argument at least`,
    chalk`Use {green \`-h\`} to get the more information`,
  );

export default {
  root,
  production,
  args,
};
