// @flow

import net from 'net';

import debug from 'debug';

const debugLog = debug('configs:sendToServer');

/**
 * @example
 * sendToServer(8000).once('data')
 *
 * @param {number} port - the port of the config server
 * @param {number} times - use to avoid timeout
 *
 * @return {object} - object like net.connect()
 */
const sendToServer = (
  port: number,
  times: number = 0,
): {
  [string]: (data: string, callback: (client: net.Socket) => void) => void,
} => {
  /**
   * @example
   * addErrorEvent('once')
   *
   * @param {string} eventName - event name
   *
   * @return {Function} - event function
   */
  const addErrorEvent = (eventName: 'once' | 'end') => (
    data: string,
    callback: (client: net.Socket) => void,
  ) => {
    const client = net.connect({ port });

    client.on('error', (err: mixed) => {
      debugLog(err);

      if (times >= 50) throw new Error('Can not connect to the server');

      setTimeout(() => {
        sendToServer(port, times + 1)[eventName](data, () => callback(client));
      }, 10);
    });

    if (eventName === 'once') client.once(data, () => callback(client));
    if (eventName === 'end') client.end(data, () => callback(client));
  };

  return {
    once: addErrorEvent('once'),
    end: addErrorEvent('end'),
  };
};

export default sendToServer;
