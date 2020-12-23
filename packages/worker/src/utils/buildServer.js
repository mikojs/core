// @flow

import net from 'net';
import stream from 'stream';

import createLogger from '@mikojs/logger';

const logger = createLogger('@mikojs/worker:buildServer');

/**
 * @param {number} port - the port of the server
 *
 * @return {object} - net server
 */
export default (port: number): net$Server => {
  const cache = {};
  let timer: TimeoutID;

  const server = net
    .createServer((socket: net.Socket) => {
      socket.setEncoding('utf8').on('data', async (data: string) => {
        const { type, filePath, argv, hasStdout } = JSON.parse(data);

        logger.debug(data);

        try {
          if (type === 'end') {
            timer = setTimeout(() => {
              if (Object.keys(cache).length !== 0) return;

              logger.debug('Close server');
              clearTimeout(timer);
              server.close();
            }, 5000);

            delete cache[filePath];
            delete require.cache[filePath];
            socket.end('end;');
            return;
          }

          if (!cache[filePath])
            // $FlowFixMe The parameter passed to require must be a string literal.
            cache[filePath] = require(filePath);

          clearTimeout(timer);
          logger.debug(cache);

          if (type === 'start') {
            socket.write('start;');
            socket.end(JSON.stringify(Object.keys(cache[filePath])));
            return;
          }

          if (hasStdout) {
            socket.write('stdout;');
            argv[0] = new stream.Writable({
              /**
               * @param {Buffer} chunk - pipline chunk
               */
              write: (chunk: Buffer | string) => {
                socket.write(chunk);
              },
            });
          }

          const serverData = JSON.stringify(
            await cache[filePath][type](...argv),
          );

          logger.debug(serverData);
          socket.write('normal;');
          socket.end(serverData);
        } catch (e) {
          logger.debug(e);
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
      logger.debug(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
