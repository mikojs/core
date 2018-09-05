#! /usr/bin/env node
// @flow

import childProcess from 'child_process';

import { invariant } from 'fbjs';
import chalk from 'chalk';
import npmWhich from 'npm-which';

import cliOptions from './core/cliOptions';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

export default ((): mixed => {
  const { configPath, config, cliName, argv } = cliOptions;

  if (process.env.USE_CONFIGS_SCRIPTS) {
    const { USE_CONFIGS_SCRIPTS } = process.env;

    delete process.env.USE_CONFIGS_SCRIPTS;

    return (config[USE_CONFIGS_SCRIPTS].config ||
      config[USE_CONFIGS_SCRIPTS])();
  }

  invariant(
    cliName,
    chalk`should give an argument at least, use {green \`-h\`} to get the more information`,
  );

  invariant(
    config[cliName],
    chalk`can not find {cyan \`${cliName}\`} in {gray \`${configPath}\`}
                     use {green \`--info\`} to get the more information`,
  );

  const CLI_CONFIG = {
    babel: ['--config-file', __filename],
    prettier: ['--config', __filename],
    'lint-staged': ['-c', __filename],
    jest: [`--config=${__filename}`],
  };
  const which = npmWhich(process.cwd());
  const cli = config[cliName].alias || cliName;

  argv[1] = which.sync(cli);
  argv.push(...CLI_CONFIG[cli]);

  return childProcess
    .spawn(argv[0], argv.slice(1), {
      stdio: 'inherit',
      env: {
        ...process.env,
        USE_CONFIGS_SCRIPTS: cliName,
      },
    })
    .on('close', (exitCode: number) => {
      process.exit(exitCode);
    });
})();
