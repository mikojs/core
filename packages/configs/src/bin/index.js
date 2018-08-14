#! /usr/bin/env node
// @flow

import path from 'path';

import { invariant } from 'fbjs';

import cliOptions from './core/cliOptions';
import runCommand from './core/runCommand';

const CONFIG_OPTION_NAME = {
  babel: '--config-file',
};

const settings = require(cliOptions.settingsPath);

invariant(
  settings[cliOptions.cliName] && settings[cliOptions.cliName].config,
  `can not find the config in the setting of \`${cliOptions.cliName}\``,
);

const { config, cliName = cliOptions.cliName } = settings[cliOptions.cliName];
const argv = [...cliOptions.argv];

argv[1] = path.resolve(path.dirname(argv[1]), cliName);
argv.push(
  CONFIG_OPTION_NAME[cliName],
  path.resolve(cliOptions.settingsPath, config),
);

runCommand(argv);
