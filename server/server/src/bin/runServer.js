#! /usr/bin/env node
// @flow

import net from 'net';

import debug from 'debug';

import { requireModule } from '@mikojs/utils';

const debugLog = debug('server:bin:runServer');
const port = parseInt(process.argv[2], 10);
const client = net.connect({ port });

debugLog(port);

client.setEncoding('utf8');
client.on('data', (data: string) => {
  debugLog(data);

  const { serverFile, ...context } = JSON.parse(data);

  requireModule(serverFile)({
    ...context,
    restart: () => {
      client.end('restart');
    },
  });

  if (context.dev && context.watch)
    process.stdin.on('data', (inputData: Buffer) => {
      const str = inputData
        .toString()
        .trim()
        .toLowerCase();

      if (str === 'rs') client.end('restart');
      else if (str === 'exit') client.end('exit');
    });
});
