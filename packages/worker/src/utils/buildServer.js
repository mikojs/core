// @flow

import net from 'net';
import stream from 'stream';

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
        const { type, filePath, argv, hasStdout } = JSON.parse(data);

        try {
          if (type === 'end') {
            timer = setTimeout(() => {
              if (Object.keys(cache).length !== 0) return;

              debugLog('Close server');
              server.close();
            }, 5000);

            delete cache[filePath];
            delete require.cache[filePath];
            socket.end('end;');
            return;
          }

          clearTimeout(timer);

          if (!cache[filePath])
            // $FlowFixMe The parameter passed to require must be a string literal.
            cache[filePath] = require(filePath);

          if (type === 'start') {
            socket.write('start;');
            socket.end(JSON.stringify(Object.keys(cache[filePath])));
            return;
          }

          if (hasStdout) {
            const stdout = new stream.Writable({
              write: (chunk: Buffer | string) => {
                socket.write(chunk);
              },
            });

            socket.write('stdout-start;');
            argv[0] = stdout;
          }

          const serverData = JSON.stringify(cache[filePath][type](...argv));

          socket.write('stdout-end;');
          socket.write('normal;');
          socket.end(serverData);
        } catch (e) {
          socket.write('error;');
          socket.end(
            JSON.stringify({
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
