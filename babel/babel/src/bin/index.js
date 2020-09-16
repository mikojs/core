#! /usr/bin/env node
// @flow

import ora from 'ora';
import watchman from 'fb-watchman';
import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import fileCommand from '@babel/cli/lib/babel/file';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const client = new watchman.Client();
const opts = parseArgv(process.argv);
const fn = opts.cliOptions.outDir ? dirCommand : fileCommand;

/** */
const watching = () => {
  client.command(
    ['watch-project', opts.cliOptions.outFile || opts.cliOptions.outDir],
    (err: Error, { warning }: {| warning?: string |}) => {
      if (err) {
        logger.fail(err.message);
        return;
      }

      if (warning) logger.warn(warning).start('Watching files');
    },
  );
};

handleUnhandledRejection();
logger.start('Watching files');
client.capabilityCheck(
  {
    optional: [],
    required: ['relative_root'],
  },
  async (err: Error, { warning }: {| warning?: string |}) => {
    if (err) {
      logger.fail(err.message);
      client.end();
      return;
    }

    if (warning) logger.warn(warning).start('Watching files');

    if (!opts) {
      process.exit(2);
      return;
    }

    try {
      await fn({
        ...opts,
        cliOptions: {
          ...opts.cliOptions,
          watch: false,
        },
      });
    } catch (e) {
      logger.error(err.message);
      process.exit(1);
    }

    if (!opts.cliOptions.watch) watching();
  },
);
