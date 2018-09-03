// @flow

import commander from 'commander';
import chalk from 'chalk';
import { invariant } from 'fbjs';

import { name, version } from '../../package.json';

let projectDir = null;

const program = new commander.Command(name)
  .version(version, '-v, --version')
  .arguments('<project-directory>')
  .usage(chalk`{green <project-directory>} {gray [options]}`)
  .option('--overwrite-all', 'overwrite all files')
  .action(arguProjectDir => {
    projectDir = arguProjectDir;
  });

const { overwriteAll = false } = program.parse(process.argv);

if (!projectDir) {
  program.outputHelp(
    () => chalk`
  Please specify the project directory:

    {cyan ${name}} {green <project-directory>}

  For example:

    {cyan ${name}} {green my-cat-project}

  Run {cyan ${name}} {gray --help} to see all options.

`,
  );
  process.exit(1);
}

export default {
  projectDir,
  overwriteAll,
  configName: null,
};
