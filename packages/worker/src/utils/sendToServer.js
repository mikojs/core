// @flow

import net from 'net';

import debug from 'debug';

const debugLog = debug('worker:sendToServer');

/**
 * @example
 * sendToServer(8000, '{}')
 *
 * @param {number} port - the port of the server
 * @param {string} data - the data which will be sent to the server
 *
 * @return {void} - not return anything
 */
const sendToServer = (port: number, data: string) =>
  new Promise<void>(resolve => {
    net
      .connect(parseInt(port, 10))
      .on('error', (err: Error) => {
        debugLog(err);
        setTimeout(() => {
          sendToServer(port, data).then(resolve);
        }, 10);
      })
      .end(data, resolve);
  });

export default sendToServer;
