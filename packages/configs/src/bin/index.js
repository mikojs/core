#! /usr/bin/env node
// @flow

import path from 'path';
import childProcess from 'child_process';

import chalk from 'chalk';
import npmWhich from 'npm-which';

import defaultConfigs from '..';

import cliOptions from 'utils/cliOptions';
import printInfo from 'utils/printInfo';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

const CONFIG_PATH = path.resolve(__dirname, '../config.js');
const { configsPath, configs, cliName, argv } = cliOptions;

if (!cliName)
  printInfo(
    [
      chalk`should give an argument at least, use {green \`-h\`} to get the more information`,
    ],
    true,
  );

if (!configs[cliName])
  printInfo(
    [
      chalk`can not find {cyan \`${cliName}\`} in {gray \`${configsPath}\`}`,
      chalk`use {green \`--info\`} to get the more information`,
    ],
    true,
  );

if (configsPath !== path.resolve(__dirname, '../index.js'))
  printInfo(
    ['Using external configsuration', `Location: ${configsPath}`],
    false,
  );

const which = npmWhich(process.cwd());
const cli = configs[cliName].alias || cliName;
const setConfig =
  /**
   * Run custom set config
   * Flow does not yet support method or property calls in optional chains.
   * $FlowFixMe
   */
  configs[cliName].setConfig?.(CONFIG_PATH) ||
  {
    babel: ['--config-file', CONFIG_PATH],
    eslint: ['-c', CONFIG_PATH],
    esw: ['-c', CONFIG_PATH],
    prettier: ['--config', CONFIG_PATH],
    'lint-staged': ['-c', CONFIG_PATH],
    jest: [`--config=${CONFIG_PATH}`],
  }[cli];

if (!setConfig)
  printInfo(
    [
      chalk`Can not set the config path for {green ${cli}}`,
      chalk`Use {green configs.${cliName}.setConfig} to set the config path`,
      'For example:',
      `  { ${cliName}: { config: {}, setConfig: (configPath) => ['--config', configPath] } }`,
    ],
    true,
  );

/**
 * Run custom argv
 * Flow does not yet support method or property calls in optional chains.
 * $FlowFixMe
 */
const defaultArgv = defaultConfigs[cliName]?.run?.(argv) || argv;
// $FlowFixMe
const realArgv = configs[cliName].run?.(defaultArgv) || defaultArgv;

// Use real cli and set config
realArgv[1] = which.sync(cli);
realArgv.push(...setConfig);

// Start
childProcess
  .spawn(realArgv[0], realArgv.slice(1), {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...configs[cliName].env,
      USE_CONFIGS_SCRIPTS: cliName,
    },
  })
  .on('close', (exitCode: number) => {
    process.exit(exitCode);
  });
