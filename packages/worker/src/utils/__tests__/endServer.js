// @flow

import net from 'net';

import findProcess from 'find-process';
import getPort from 'get-port';

import endServer from '../endServer';

describe('end server', () => {
  test('can not find main process', async () => {
    findProcess.mockReturnValue([]);

    expect(await endServer(__filename)).toBeUndefined();
  });

  test('can find main process', async () => {
    const mockCallback = jest.fn();
    const port = await getPort();
    const server = net
      .createServer((socket: net.Socket) => {
        socket.setEncoding('utf8').on('data', mockCallback);
        socket.end();
      })
      .listen(port);

    findProcess.mockReturnValue([{ cmd: port.toString(), pid: 1 }]);

    expect(await endServer(__filename)).toBeUndefined();
    expect(mockCallback).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'end',
        filePath: __filename,
        argv: [],
        hasStdout: false,
      }),
    );

    server.close();
  });
});
