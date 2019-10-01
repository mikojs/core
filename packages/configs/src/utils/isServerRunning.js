// @flow

import net from 'net';

import debug from 'debug';

const debugLog = debug('configs:isServerRunning');

/**
 * @example
 * isServerRunning(8000)
 *
 * @param {number} port - the port to check
 *
 * @return {Promise} - finish checking
 */
export default (port: number) =>
  new Promise<void, string>((resolve, reject) => {
    let times: number = 0;
    const interval = setInterval(() => {
      const client = net.connect({ port });

      client.on('error', (err: {| code: string |}) => {
        times += 1;
        debugLog(err);

        if (err.code !== 'ECONNREFUSED') reject(err);
        if (times >= 100) reject(new Error('Can not connect the server'));
      });

      client.on('connect', () => {
        debugLog('connect');
        clearInterval(interval);
        client.destroy();
        resolve();
      });
    }, 10);
  });
