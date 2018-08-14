#! /usr/bin/env node
// @flow

import path from 'path';

import { invariant } from 'fbjs';

import cliOptions from './core/cliOptions';
import runCommand from './core/runCommand';

const CONFIG_OPTION_NAME = {
  babel: '--config-file',
  'lint-staged': '-c',
  prettier: '--config',
  jest: {
    name: '--config',
    useEqual: true,
  },
};

const settings = require(cliOptions.settingsPath);
const cliSetting = settings[cliOptions.cliName];

invariant(
  cliSetting,
  `can not find the config in the setting of \`${cliOptions.cliName}\``,
);

const { config, cliName = cliOptions.cliName } = cliSetting.config
  ? cliSetting
  : { config: cliSetting };
const argv = [...cliOptions.argv];
const configPath = path
  .resolve(cliOptions.settingsPath, config)
  .replace(process.cwd(), '.');

argv[1] = path.resolve(path.dirname(argv[1]), cliName);

if (CONFIG_OPTION_NAME[cliName].useEqual)
  argv.push(`${CONFIG_OPTION_NAME[cliName].name}=${configPath}`);
else argv.push(CONFIG_OPTION_NAME[cliName], configPath);

runCommand(argv);
