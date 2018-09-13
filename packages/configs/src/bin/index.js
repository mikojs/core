#! /usr/bin/env node
// @flow

import childProcess from 'child_process';

import rimraf from 'rimraf';
import debug from 'debug';

import cliOptions from 'utils/cliOptions';
import configs from 'utils/configs';
import generateFiles from 'utils/generateFiles';
import worker, { cachePath, cacheLockPath } from 'utils/worker';

const { cliName } = cliOptions;
const { argv, env, cli } = configs.getConfig(cliOptions);
const debugLog = debug(`configs-scripts:bin[${cliName}]`);

process.on('unhandledRejection', (error: mixed) => {
  throw error;
});

process.on('SIGINT', () => {
  debugLog('Detect `SIGINT`, remove cache');
  rimraf.sync(cachePath);
  rimraf.sync(cacheLockPath);
  process.exit();
});

(async (): Promise<void> => {
  // handle config and ignore files
  await generateFiles();

  // run command
  debugLog(
    `Run command: ${JSON.stringify([argv[0], cli, ...argv.slice(2)], null, 2)}`,
  );
  childProcess
    .spawn(argv[0], [cli, ...argv.slice(2)], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env,
      },
    })
    .on('close', (exitCode: number) => {
      debugLog('Run command done, remove files');
      worker.removeFiles().then(() => {
        debugLog('Remove files done, close process');
        process.exit(exitCode);
      });
    });
})();
