#! /usr/bin/env node
// @flow

import path from 'path';
import childProcess from 'child_process';

import chalk from 'chalk';
import npmWhich from 'npm-which';

import defaultConfigs from '..';

import cliOptions from './core/cliOptions';
import printInfo from './core/printInfo';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

export default ((): mixed => {
  const { configsPath, configs, cliName, argv } = cliOptions;

  // Return real config
  if (process.env.USE_CONFIGS_SCRIPTS) {
    const { USE_CONFIGS_SCRIPTS } = process.env;
    const useConfig =
      configs[USE_CONFIGS_SCRIPTS].config || configs[USE_CONFIGS_SCRIPTS];
    const useDefaultConfig =
      defaultConfigs[USE_CONFIGS_SCRIPTS].config ||
      defaultConfigs[USE_CONFIGS_SCRIPTS];

    delete process.env.USE_CONFIGS_SCRIPTS;

    return useConfig(
      useConfig === useDefaultConfig ? null : useDefaultConfig(),
    );
  }

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
    configs[cliName].setConfig?.(__filename) ||
    {
      babel: ['--config-file', __filename],
      eslint: ['-c', __filename],
      esw: ['-c', __filename],
      prettier: ['--config', __filename],
      'lint-staged': ['-c', __filename],
      jest: [`--config=${__filename}`],
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
  const realArgv = configs[cliName].run?.(argv) || argv;

  // Use real cli and set config
  realArgv[1] = which.sync(cli);
  realArgv.push(...setConfig);

  // Start
  return childProcess
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
})();
