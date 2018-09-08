#! /usr/bin/env node
// @flow

import childProcess from 'child_process';

import cliOptions from 'utils/cliOptions';
import configs from 'utils/configs';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

const { cliName, argv } = cliOptions;
const { run, env, cli, removeConfigFiles } = configs.getConfig(cliName);
const realArgv = run(argv);

childProcess
  .spawn(realArgv[0], [cli, ...realArgv.slice(2)], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
    },
  })
  .on('close', (exitCode: number) => {
    removeConfigFiles().then(() => {
      process.exit(exitCode);
    });
  });
