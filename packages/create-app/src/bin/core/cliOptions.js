// @flow

import commander from 'commander';
import chalk from 'chalk';

import { version } from '../../../package.json';

const program = new commander.Command('create-cat')
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>}`);

const {
  args: [projectDir],
} = program.parse(process.argv);

if (!projectDir) {
  program.outputHelp(
    (defaultHelp: string) => chalk`
{red Error: <project-directory> is required.}

${defaultHelp}`,
  );
  process.exit(1);
}

export default {
  projectDir,
};
