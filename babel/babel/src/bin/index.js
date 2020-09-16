#! /usr/bin/env node
// @flow

import crypto from 'crypto';

import ora from 'ora';
import watchman from 'fb-watchman';
import parseArgv from '@babel/cli/lib/babel/options';
import dirCommand from '@babel/cli/lib/babel/dir';
import fileCommand from '@babel/cli/lib/babel/file';

import { handleUnhandledRejection, createLogger } from '@mikojs/utils';

const logger = createLogger('@mikojs/miko', ora({ discardStdin: false }));
const client = new watchman.Client();
const opts = parseArgv(process.argv);

/** */
const watching = () => {
  const fileOrDir = opts.cliOptions.outFile || opts.cliOptions.outDir;
  const hash = crypto.createHash('md5').update('@mikojs/babel').digest('hex');

  if (!fileOrDir) return;

  client.command(
    ['watch-project', fileOrDir],
    (
      err: Error,
      {
        warning,
        watch,
        relative_path: relativePath,
      }: {| warning?: string, watch: mixed, relative_path?: string |},
    ) => {
      if (err) {
        logger.fail(err.message);
        return;
      }

      if (warning) logger.warn(warning).start('Watching files');

      client.command(
        [
          'subscribe',
          watch,
          hash,
          {
            ...(!relativePath
              ? {}
              : {
                  relative_root: relativePath,
                }),
            expression: [
              'allof',
              ['match', opts.cliOptions.extensions || '*.js'],
            ],
            fields: ['name', 'exists', 'type'],
          },
        ],
        (subErr: Error) => {
          if (subErr) {
            logger.fail(subErr.message);
            return;
          }
        },
      );

      client.on(
        'subscription',
        ({ subscription }: {| subscription: string |}) => {
          if (subscription !== hash) return;

          /*
        files.forEach(file => {
          console.log(file);
        });
        */
        },
      );
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
      const fn = opts.cliOptions.outDir ? dirCommand : fileCommand;

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
    else logger.succeed('Done');
  },
);
