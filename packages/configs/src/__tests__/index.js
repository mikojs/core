// @flow

import net from 'net';
import path from 'path';
import getPort from 'get-port';

import getConfig from '../index';

import configs from 'utils/configs';

test('get config', async () => {
  const port = await getPort();
  const server = net.createServer((socket: net.Socket) => {
    socket.on('data', () => {
      server.close();
    });
  });

  configs.handleCustomConfigs({
    config: {
      getConfig: {},
    },
    filepath: path.resolve(process.cwd(), './.catrc.js'),
  });
  server.listen(port);

  expect(getConfig('getConfig', port, path.resolve('jest.config.js'))).toEqual(
    {},
  );
});
