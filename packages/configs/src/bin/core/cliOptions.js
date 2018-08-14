// @flow

import fs from 'fs';
import path from 'path';
import { invariant } from 'fbjs';

import commander from 'commander';
import chalk from 'chalk';

import { version } from '../../../package.json';

const program = new commander.Command('configs-scripts')
  .version(version, '-v, --version')
  .arguments('[arguments...]')
  .usage(chalk`{green [arguments...]} {gray [options]}`)
  .description(
    chalk`{green Arguments} can be any commands, like {cyan \`babel src -d lib\`}.`,
  )
  .allowUnknownOption()
  .option(
    '--configs-settings <path or module name>',
    'set the settings of the configs',
  );

const {
  configsSettings = path.resolve(__dirname, '../..'),
  args: [cliName],
  rawArgs,
} = program.parse(process.argv);

const cliOptions = {
  settingsPath: configsSettings,
  cliName,
  argv: rawArgs.filter(
    arg => !['--configs-settings', configsSettings, cliName].includes(arg),
  ),
};

invariant(
  cliName,
  'should give an argument at least, use `-h` to get the more information',
);

if (!fs.existsSync(configsSettings)) {
  try {
    cliOptions.settingsPath = require.resolve(configsSettings);
  } catch (e) {
    if (/Cannot find module/.test(e.message))
      throw new Error(
        `can not get the settings from the module: ${configsSettings}`,
      );

    throw e;
  }
}

export default cliOptions;
