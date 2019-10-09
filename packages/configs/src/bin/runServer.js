#! /usr/bin/env node
// @flow

import net from 'net';

import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

import createServer from 'utils/createServer';

const debugPort = !process.env.DEBUG_PORT
  ? -1
  : parseInt(process.env.DEBUG_PORT, 10);
const debugLog = !process.env.DEBUG_PORT
  ? debug('configs:runServer')
  : (data: mixed) => {
      if (typeof data === 'number')
        net.connect({ port: debugPort }).end(data.toString());
      else if (typeof data === 'string')
        net.connect({ port: debugPort }).end(data);
      else
        net
          .connect({ port: debugPort })
          .end(JSON.stringify(data, null, 2) || '');
    };

handleUnhandledRejection();
createServer(parseInt(process.argv[2], 10), debugLog);
