// @flow

import commander from 'commander';
import chalk from 'chalk';

import { version } from '../../package.json';

export default (
  argv: $ReadOnlyArray<string>,
) => {
  const program = new commander.Command('mono-flow')
    .version(version, '-v, --version')
    .arguments('[command type, arguments...]')
    .usage(chalk`{green [command type, arguments...]} {gray [options]}`)
    .description('');

  console.log(program.parse([...argv]));
};
