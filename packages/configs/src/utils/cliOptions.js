// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import cosmiconfig from 'cosmiconfig';

import { version } from '../../package.json';

import printInfos from './printInfos';

/*
 * Should be fixed in `https://github.com/flow-typed/flow-typed/pull/2690`
 * $FlowFixMe
 */
const program = new commander.Command('configs-scripts')
  .version(version, '-v, --version')
  .arguments('[arguments...]')
  .usage(chalk`{green [arguments...]} {gray [options]}`)
  .description(
    chalk`{green Arguments} can be any commands, like {cyan \`babel src -d lib\`}.`,
  )
  .option('--info', 'print more info about configs')
  .allowUnknownOption();

const {
  args: [cliName],
  rawArgs,
  info = false,
} = program.parse(process.argv);

if (info) {
  program.outputHelp((): string => 'TODO');
  process.exit();
}

if (!cliName)
  printInfos(
    [
      chalk`Should give an argument at least`,
      chalk`Use {green \`-h\`} to get the more information`,
    ],
    true,
  );

export default {
  cliName,
  argv: rawArgs.filter((arg: string): boolean => ![cliName].includes(arg)),
};
