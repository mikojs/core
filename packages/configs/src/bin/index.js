#! /usr/bin/env node
// @flow

import childProcess from 'child_process';

import rimraf from 'rimraf';

import cliOptions from 'utils/cliOptions';
import configs from 'utils/configs';
import generateFiles from 'utils/generateFiles';
import worker, { cachePath, cacheLockPath } from 'utils/worker';

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

process.on('SIGINT', () => {
  rimraf.sync(cachePath);
  rimraf.sync(cacheLockPath);
  process.exit();
});

const { argv, env, cli } = configs.getConfig(cliOptions);

(async (): Promise<void> => {
  // handle config and ignore files
  await generateFiles();

  // run command
  childProcess
    .spawn(argv[0], [cli, ...argv.slice(2)], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env,
      },
    })
    .on('close', (exitCode: number) => {
      worker.removeFiles().then(() => {
        process.exit(exitCode);
      });
    });
})();
