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
  let currentEvent: ?string;

  const server = net
    .createServer((socket: net.Socket) => {
      socket.setEncoding('utf8').on('data', (data: string) => {
        const { type, filePath, argv } = JSON.parse(data);

        currentEvent = filePath;

        if (type === 'end') {
          delete cache[filePath];
          delete require.cache[filePath];
          timer = setTimeout(() => {
            if (Object.keys(cache).length !== 0) return;

            server.close(() => {
              debugLog('Close server');
            });
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

        currentEvent = undefined;
      });
    })
    .on('error', (err: Error) => {
      debugLog(err);

      if (currentEvent && cache[currentEvent] && cache[currentEvent].error)
        cache[currentEvent].error(err);
    })
    .listen(port, () => {
      debugLog(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
