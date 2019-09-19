#! /usr/bin/env node
// @flow

import net from 'net';

import commander from 'commander';
import chalk from 'chalk';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { requireModule } from '@mikojs/utils';

import { version } from '../../package.json';

import logger from 'utils/logger';

const debugLog = debug('server:bin:server');
const program = new commander.Command('server')
  .version(version, '-v, --version')
  .arguments('<server file path>')
  .usage(chalk`{green <server file path>}`)
  .description(
    chalk`Example:
  server {green ./server.js} {gray --src ./src --dir ./lib}`,
  )
  .option('--src <path>', 'src folder path')
  .option('--dir <path>', 'dir folder path')
  .option('--watch', 'use watch mode')
  .option('--watch-port <port>', 'the port for watch server');

const {
  args: [serverFile],
  src,
  dir,
  watch = false,
  watchPort = null,
} = program.parse([...process.argv]);

debugLog(process.argv);

if (!src || !dir || !serverFile)
  throw logger.fail(
    chalk`{red src, dir, serverFile} is required, but get {gray ${src}, ${dir}, ${serverFile}}`,
  );

const client = watchPort
  ? net.connect({ port: watchPort })
  : {
      end: emptyFunction,
    };
const context = {
  src,
  dir,
  dev: process.env.NODE_ENV !== 'production',
  watch,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  restart: () => {
    client.end('restart');
  },
};

process.stdin.on('data', (data: Buffer) => {
  const str = data
    .toString()
    .trim()
    .toLowerCase();

  if (str === 'rs') client.end('restart');
  else if (str === 'exit') client.end('exit');
});

debugLog(context);

requireModule(serverFile)(context);
