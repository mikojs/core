// @flow

import net from 'net';

import debug from 'debug';

import findMainServer from './findMainServer';

const debugLog = debug('configs:sendToServer');

/**
 * @example
 * sendToServer().once('data')
 *
 * @return {object} - object like net.connect()
 */
const sendToServer = (): {
  [string]: (
    data: string,
    callback: (client: net.Socket) => void,
  ) => Promise<void>,
} => {
  /**
   * @example
   * addErrorEvent('once')
   *
   * @param {string} eventName - event name
   *
   * @return {Function} - event function
   */
  const addErrorEvent = (eventName: 'once' | 'end') => async (
    data: string,
    callback: (client: net.Socket) => void,
  ) => {
    const mainServer = await findMainServer();

    if (!mainServer) return;

    const client = net.connect({ port: parseInt(mainServer.port, 10) });

    client.on('error', (err: mixed) => {
      debugLog(err);
      setTimeout(sendToServer()[eventName], 10, data, () => callback(client));
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
