// @flow

import commander from 'commander';
import debug from 'debug';
import chalk from 'chalk';

import { version } from '../../../package.json';

import logger from 'utils/logger';

const debugLog = debug('run-env:cliOptions');

const program = new commander.Command('run-dev')
  .version(version, '-v, --version')
  .arguments('[commands...]')
  .usage(chalk`{green [commands...]} {gray [options]}`)
  .description(
    chalk`Example:

  run-env {green 'babel -w'}
  run-env {green 'babel -w'} {gray -r root}`,
  )
  .option(
    '-r, --root [root folder]',
    'the root folder of project. Default: src',
  );

const { root = 'src', args } = program.parse(process.argv);

debugLog({
  root,
  args,
});

if (args.length === 0)
  logger.error(
    chalk`Should give an argument at least`,
    chalk`Use {green \`-h\`} to get the more information`,
  );

export default {
  root,
  args,
};
