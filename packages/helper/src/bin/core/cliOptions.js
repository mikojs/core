// @flow

import commander from 'commander';
import debug from 'debug';

import { version } from '../../../package.json';

const debugLog = debug('run-env:cliOptions');

const program = new commander.Command('run-dev')
  .version(version, '-v, --version')
  .option(
    '-r, --root [root folder]',
    'the root folder of project. Default: src',
  );

const { root = 'src', args } = program.parse(process.argv);

debugLog({
  root,
  args,
});

export default {
  root,
  args,
};
