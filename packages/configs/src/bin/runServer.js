#! /usr/bin/env node
// @flow

import net from 'net';

import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

import createServer from 'utils/createServer';
import findMainServer from 'utils/findMainServer';

const debugPort = !process.env.DEBUG_PORT
  ? -1
  : parseInt(process.env.DEBUG_PORT, 10);
const debugLog = !process.env.DEBUG_PORT
  ? debug('configs:runServer')
  : async (data: mixed) => {
      const mainServer = await findMainServer();
      const prefix = `(${mainServer?.isMain ? 'main' : 'other'}) ${
        process.pid
      } --> `;
      const client = net.connect({ port: debugPort });

      if (typeof data === 'number') client.end(`${prefix}${data.toString()}`);
      else if (typeof data === 'string') client.end(`${prefix}${data}`);
      else client.end(`${prefix}${JSON.stringify(data, null, 2) || ''}`);
    };

handleUnhandledRejection();

(async () => {
  const mainServer = await findMainServer();

  if (!mainServer?.isMain) return;

  createServer(parseInt(process.argv[2], 10), debugLog);
})();
