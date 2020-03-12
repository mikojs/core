// @flow

import net from 'net';

import debug from 'debug';

const debugLog = debug('worker:buildServer');

/**
 * @example
 * buildServer(8000)
 *
 * @param {number} port - the port of the server
 *
 * @return {object} - net server
 */
export default (port: number): net$Server => {
  const cache = {};
  let timer: TimeoutID;

  const server = net
    .createServer((socket: net.Socket) => {
      socket.setEncoding('utf8').on('data', (data: string) => {
        const { type, filePath, argv } = JSON.parse(data);

        try {
          if (type === 'end') {
            delete cache[filePath];
            delete require.cache[filePath];
            socket.write('[end][end]');
            timer = setTimeout(() => {
              if (Object.keys(cache).length !== 0) return;

              debugLog('Close server');
              server.close();
            }, 5000);
          } else {
            clearTimeout(timer);

            if (!cache[filePath])
              // $FlowFixMe The parameter passed to require must be a string literal.
              cache[filePath] = require(filePath);

            if (type === 'start') {
              socket.write('[start]');
              socket.write(JSON.stringify(Object.keys(cache[filePath])));
              socket.write('[start]');
            } else {
              socket.write('[normal]');
              socket.write(JSON.stringify(cache[filePath][type](...argv)));
              socket.write('[normal]');
            }
          }
        } catch (e) {
          socket.write('[error]');
          socket.write(JSON.stringify({
            message: e.message,
            stack: e.stack,
          }));
          socket.write('[error]');
        }

        socket.end();
      });
    })
    .listen(port, () => {
      debugLog(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
