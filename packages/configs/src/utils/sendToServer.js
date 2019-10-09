// @flow

import net from 'net';

import debug from 'debug';

import findMainServer from './findMainServer';

const debugLog = debug('configs:sendToServer');
const sendToServer = {
  end: async (data: string, callback: (client: net.Socket) => void) => {
    const mainServer = await findMainServer();

    if (!mainServer) return;

    const client = net.connect({ port: parseInt(mainServer.port, 10) });

    client.on('error', (err: mixed) => {
      debugLog(err);
      setTimeout(sendToServer.end, 10, data, () => callback(client));
    });

    client.end(data, () => callback(client));
  },
};

export default sendToServer;
