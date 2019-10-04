#! /usr/bin/env node
// @flow

import fs from 'fs';

import findProcess from 'find-process';
import debug from 'debug';

import { handleUnhandledRejection } from '@mikojs/utils';

import createServer, { type serverArguType } from 'utils/createServer';

const port = parseInt(process.argv[2], 10);
const debugLog = !process.env.CONFIG_SERVER_DEBUG
  ? debug('configs:runServer')
  : ((): ((data: mixed) => void) & {
      close: () => void,
    } => {
      const fsStream = fs.createWriteStream('config-server-debug');

      /**
       * @example
       * log('message')
       *
       * @param {string} data - the data is used to be logged
       */
      const log = (data: mixed) => {
        if (typeof data === 'number') fsStream.write(data.toString());
        else if (typeof data === 'string') fsStream.write(data);
        else fsStream.write(JSON.stringify(data, null, 2) || '');

        fsStream.write('\n\n');
      };

      /**
       * @example
       * log.close()
       */
      log.close = () => {
        fsStream.close();
      };

      return log;
    })();

handleUnhandledRejection();
createServer(
  port,
  debugLog,
  async ({ type, cache }: serverArguType): Promise<number> => {
    if (type === 'close') {
      // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
      debugLog.close?.(); // eslint-disable-line flowtype/no-unused-expressions
      return port;
    }

    const [existServer] = (await findProcess('name', __filename)).slice(-1);

    debugLog(existServer);
    debugLog(process.pid);

    if (existServer.pid === process.pid) return port;

    const [existServerPort] = existServer.cmd.split(/ /).slice(-1);

    debugLog(existServerPort);

    return existServerPort;
  },
);
