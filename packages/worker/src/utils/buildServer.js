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
        const { hash, type, filePath, argv } = JSON.parse(data);

        try {
          if (type === 'end') {
            delete cache[filePath];
            delete require.cache[filePath];
            socket.end();
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

            if (type === 'start')
              socket.end(JSON.stringify(Object.keys(cache[filePath])));
            else socket.end(JSON.stringify(cache[filePath][type](...argv)));
          }
        } catch (e) {
          // FIXME
          // eslint-disable-next-line flowtype/no-unused-expressions
          cache[filePath]?.error(e);
          socket.end(
            JSON.stringify({
              hash,
              type: 'error',
              message: e.message,
              stack: e.stack,
            }),
          );
        }
      });
    })
    .listen(port, () => {
      debugLog(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
