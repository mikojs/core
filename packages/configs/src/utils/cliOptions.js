// @flow

import path from 'path';

import commander from 'commander';
import chalk from 'chalk';
import cosmiconfig from 'cosmiconfig';

import { version } from '../../package.json';

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

const configsPath =
  cosmiconfig('cat').searchSync()?.filepath || path.resolve(__dirname, '../..');
const configs = require(configsPath);

if (info) {
  program.outputHelp(
    (): string => `${JSON.stringify(
      {
        cliNames: Object.keys(configs),
      },
      null,
      2,
    )}
`,
  );
  process.exit();
}

export default {
  configsPath,
  configs,
  cliName,
  argv: rawArgs.filter((arg: string): boolean => ![cliName].includes(arg)),
};
