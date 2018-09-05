#! /usr/bin/env node
// @flow

import path from 'path';
import childProcess from 'child_process';

import { invariant } from 'fbjs';
import chalk from 'chalk';
import findUp from 'find-up';

import { CLI_MODULES, CLI_CONFIG } from './core/constants';
import cliOptions from './core/cliOptions';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

const { configPath, config, cliName, argv } = cliOptions;

export default ((): mixed => {
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

  const cli = config[cliName].alias || cliName;
  const modulePkgPath = (CLI_MODULES[cli] || [cli]: [string]).reduce(
    (result: string | false, moduleName: string): string | false => {
      try {
        return (
          result ||
          findUp.sync('package.json', { cwd: require.resolve(moduleName) })
        );
      } catch (e) {
        if (!/Cannot find module/.test(e.message)) throw e;

        return result;
      }
    },
    false,
  );

  invariant(modulePkgPath, `Cannot find cli '${cli}'`);

  const modulePkg = require(modulePkgPath);

  argv[1] = path.resolve(
    path.dirname(modulePkgPath),
    modulePkg.bin[cli] || modulePkg.bin,
  );
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
