// @flow

import fs from 'fs';
import net from 'net';

import { areEqual } from 'fbjs';
import moment from 'moment';
import outputFileSync from 'output-file-sync';
import rimraf from 'rimraf';
import debug from 'debug';

import configs from './configs';

const debugLog = debug('configs-scripts:worker');

/** Use to control file */
class Worker {
  cache = {};

  server = null;

  init = (): Promise<{}> => new Promise(resolve => {
    this.server = net.createServer((socket) => {
      socket.setEncoding('utf8');
      socket.on('data', (data) => {
        this.writeCache(JSON.parse(data));
      });
    });

    this.server.on('error', (err: mixed) => {
      if (err) {
        this.server = null;
        resolve(null);
      }
    });

    this.server.listen(8888, () => {
      debugLog('Open server at 8888');
      resolve(this.server);
    });
  });

  /**
   * Write cache
   *
   * @example
   * worker.writeCache({})
   *
   * @param {string} cache - cache
   */
  writeCache = (data: {
    filePath?: string,
    key?: {
      cwd: string,
      argv: string,
    },
    using: string | false,
  }) => {
    const { filePath, key, using } = data;

    if (this.server) {
      debugLog(`Write cache: ${JSON.stringify(data, null, 2)}`);

      if (!using) {
        Object.keys(this.cache).forEach((cacheFilePath: string) => {
          this.cache[cacheFilePath].keys = this.cache[cacheFilePath].keys.filter(
            (cacheKey: {}): boolean =>
              !areEqual(key, cacheKey)
          );

          if (this.cache[cacheFilePath].keys.length === 0 && fs.existsSync(cacheFilePath)) {
            if (moment().diff(this.cache[cacheFilePath].using, 'seconds') > 0.5) {
              delete this.cache[cacheFilePath];
              rimraf.sync(cacheFilePath);
              debugLog(`Remove file: ${cacheFilePath}`);
            }
          }
        });

        debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
        return;
      }

      if (!this.cache[filePath]) this.cache[filePath] = { keys: [] };
      if (key) this.cache[filePath].keys.push(key);

      this.cache[filePath].using = using;
      debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
      return;
    }

    net.connect({ port: 8888 })
      .end(JSON.stringify(data));
  };
}

export default new Worker();
