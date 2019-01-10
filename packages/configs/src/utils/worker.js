// @flow

import fs from 'fs';
import net from 'net';

import moment from 'moment';
import rimraf from 'rimraf';
import debug from 'debug';

import logger from './logger';

const debugLog = debug('configs:worker');

export type cacheType = {
  filePath?: string,
  pid?: number,
  using: string | false,
};

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

  port = 8888;

  /**
   * @example
   * worker.init()
   *
   * @return {Promise} - a server or null
   */
  init = async (): Promise<net.Server | null> => {
    this.server = await new Promise(resolve => {
      const server = net.createServer((socket: net.Socket) => {
        socket.setEncoding('utf8');
        socket.on('data', (data: string) => {
          this.writeCache(JSON.parse(data));
        });
      });

      server.on('error', (err: mixed) => {
        resolve(null);
      });

      server.listen(this.port, undefined, undefined, () => {
        debugLog(`Open server at ${this.port}`);
        resolve(server);
      });
    });

    return this.server;
  };

  /**
   * @example
   * worker.writeCache({})
   *
   * @param {string} data - cache
   *
   * @return {client | null} - a client socket or null
   */
  writeCache = (data: cacheType): ?net.Socket => {
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
            /**
             * Avoid main process have child_process, but main process exit before child_process done.
             * For example, run `jest` with `--coverage`.
             * Building coverage will do after jest close
             */
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
        throw logger.fail('filePath can not be undefined in worker.writeCache');
      else {
        if (!this.cache[filePath]) this.cache[filePath] = { pids: [] };
        if (pid) this.cache[filePath].pids.push(pid);

        this.cache[filePath].using = using;
        debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
      }

      return null;
    }

    if (!using) throw logger.fail('client can not remove cache');

    const client = net.connect({ port: this.port });

    client.end(JSON.stringify(data));

    return client;
  };
}

export default new Worker();
