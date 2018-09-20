// @flow

import fs from 'fs';
import net from 'net';

import moment from 'moment';
import rimraf from 'rimraf';
import debug from 'debug';

import printInfos from './printInfos';

const debugLog = debug('configs-scripts:worker');

/** Use to control file */
export class Worker {
  /**
   * @example
   * new Worker();
   *
   * @param {number} port - port of server
   */
  constructor(port?: number = 8888) {
    this.port = port;
  }

  cache = {};

  server = null;

  /**
   * Init a worker
   *
   * @example
   * worker.init()
   *
   * @return {Promise} - a server or null
   */
  init = (): Promise<net.Server | null> =>
    new Promise(resolve => {
      this.server = net.createServer((socket: net.Socket) => {
        socket.setEncoding('utf8');
        socket.on('data', (data: string) => {
          this.writeCache(JSON.parse(data));
        });
      });

      this.server.on('error', (err: mixed) => {
        this.server = null;
        resolve(null);
      });

      this.server.listen(this.port, undefined, undefined, () => {
        debugLog(`Open server at ${this.port}`);
        resolve(this.server);
      });
    });

  /**
   * Write cache
   *
   * @example
   * worker.writeCache({})
   *
   * @param {string} data - cache
   *
   * @return {client | null} - a client or null
   */
  writeCache = (data: {
    filePath?: string,
    pid?: number,
    using: string | false,
  }): ?net.Socket => {
    const { filePath, pid, using } = data;

    if (this.server) {
      debugLog(`Write cache: ${JSON.stringify(data, null, 2)}`);

      if (!using && !filePath) {
        Object.keys(this.cache).forEach((cacheFilePath: string) => {
          this.cache[cacheFilePath].pids = this.cache[
            cacheFilePath
          ].pids.filter((cachePid: number): boolean => pid !== cachePid);

          if (
            this.cache[cacheFilePath].pids.length === 0 &&
            fs.existsSync(cacheFilePath)
          ) {
            if (
              moment().diff(this.cache[cacheFilePath].using, 'seconds') > 0.5
            ) {
              delete this.cache[cacheFilePath];
              rimraf.sync(cacheFilePath);
              debugLog(`Remove file: ${cacheFilePath}`);
            }
          }
        });

        debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
        return null;
      }

      if (!filePath)
        return printInfos(
          ['filePath can not be undefined in worker.writeCache'],
          true,
        );

      if (!this.cache[filePath]) this.cache[filePath] = { pids: [] };
      if (pid) this.cache[filePath].pids.push(pid);

      this.cache[filePath].using = using;
      debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
      return null;
    }

    const client = net.connect({ port: this.port });

    client.end(JSON.stringify(data));
    return client;
  };
}

export default new Worker();
