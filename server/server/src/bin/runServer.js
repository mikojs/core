#! /usr/bin/env node
// @flow

import net from 'net';

import debug from 'debug';

import { requireModule } from '@mikojs/utils';

import { type contextType } from '../index';

const debugLog = debug('server:bin:runServer');
const port = parseInt(process.argv[2], 10);
const client = net.connect({ port });

debugLog(port);

client.setEncoding('utf8');
client.on('data', async (data: string) => {
  debugLog(data);

  const { serverFile, ...context } = JSON.parse(data);
  const isWatching = context.dev && context.watch;

  if (isWatching)
    process.stdin.on('data', (inputData: Buffer) => {
      const str = inputData
        .toString()
        .trim()
        .toLowerCase();

      if (str === 'rs') client.end('restart');
      else if (str === 'close') client.end('close');
    });

  try {
    await requireModule(serverFile)(
      ({
        ...context,
        restart: () => {
          client.end('restart');
        },
        close: () => {
          client.end('close');
        },
      }: contextType),
    );

    if (isWatching) client.write('watching');
  } catch (e) {
    debugLog(e);
    client.write('error');
  }
});
