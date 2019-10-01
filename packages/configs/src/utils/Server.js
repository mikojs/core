// @flow

import fs from 'fs';
import net from 'net';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import debug from 'debug';

const debugLog = debug('configs:Server');

export type cacheType = {|
  pid: number,
  filePath: string,
|};

/** Use to control file */
export default class Server {
  timer: IntervalID;

  +server: net.Server;

  +cache = {};

  /**
   * @example
   * new Server(8000)
   *
   * @param {number} port - the port of the server
   */
  constructor(port: number) {
    this.server = net.createServer((socket: net.Socket) => {
      socket.setEncoding('utf8');
      socket.write(JSON.stringify(this.cache));
      socket.on('data', (data: string) => {
        debugLog(data);
        this.writeCache(JSON.parse(data));
      });
    });

    this.server.on('error', (err: mixed) => {
      debugLog(err);
    });

    this.server.listen(port, () => {
      debugLog(`Open server at ${port}`);
    });
  }

  /**
   * @example
   * server.writeCache({})
   *
   * @param {cacheType} data - cache
   */
  +writeCache = ({ pid, filePath }: cacheType) => {
    if (!this.cache[filePath]) this.cache[filePath] = { pids: [] };
    if (pid) this.cache[filePath].pids.push(pid);

    debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      Object.keys(this.cache).forEach((cacheFilePath: string) => {
        this.cache[cacheFilePath].pids = this.cache[cacheFilePath].pids.filter(
          isRunning,
        );

        if (this.cache[cacheFilePath].pids.length === 0) {
          if (fs.existsSync(cacheFilePath)) rimraf.sync(cacheFilePath);

          delete this.cache[cacheFilePath];

          debugLog(`Remove file: ${cacheFilePath}`);
          debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
        }
      });

      if (Object.keys(this.cache).length === 0)
        this.server.close(() => {
          clearInterval(this.timer);
          debugLog('Close server');
        });
    }, 500);
  };
}
