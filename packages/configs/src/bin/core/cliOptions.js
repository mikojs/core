// @flow

import fs from 'fs';
import path from 'path';
import { invariant } from 'fbjs';

import commander from 'commander';
import chalk from 'chalk';
import findUp from 'find-up';

import { version } from '../../../package.json';

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

const configPath = findUp.sync('cat.config.js') || path.resolve(__dirname, '../..');
const config = require(configPath);

if (info) {
  program.outputHelp((): string => `${JSON.stringify({
    cliNames: Object.keys(config),
  }, null, 2)}
`);
  process.exit();
}

invariant(
  cliName,
  chalk`should give an argument at least, use {green \`-h\`} to get the more information`,
);

export default {
  configPath,
  config,
  cliName,
  argv: rawArgs.filter(
    (arg: string): boolean =>
      ![cliName].includes(arg),
  ),
};
