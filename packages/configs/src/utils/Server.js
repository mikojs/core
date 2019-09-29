// @flow

import fs from 'fs';
import net from 'net';

import moment from 'moment';
import rimraf from 'rimraf';
import debug from 'debug';

const debugLog = debug('configs:Server');

export type cacheType = {|
  pid: number,
  filePath: string | false,
|};

/** Use to control file */
export default class Server {
  +cache = {};

  /**
   * @example
   * new Server(8000)
   *
   * @param {number} port - the port of the server
   */
  constructor(port: number) {
    const server = net.createServer((socket: net.Socket) => {
      socket.setEncoding('utf8');
      socket.on('data', (data: string) => {
        debugLog(data);
        this.writeCache(JSON.parse(data));
      });
    });

    server.on('error', (err: mixed) => {
      debugLog(err);
    });

    server.listen(port, () => {
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
    if (filePath) {
      if (!this.cache[filePath]) this.cache[filePath] = { pids: [] };
      if (pid) this.cache[filePath].pids.push(pid);

      this.cache[filePath].using = moment().format();
      debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
      return;
    }

    Object.keys(this.cache).forEach((cacheFilePath: string) => {
      this.cache[cacheFilePath].pids = this.cache[cacheFilePath].pids.filter(
        (cachePid: number) => pid !== cachePid,
      );

      if (
        this.cache[cacheFilePath].pids.length === 0 &&
        fs.existsSync(cacheFilePath)
      ) {
        /**
         * Avoid main process have child_process, but main process exit before child_process done.
         * For example, run `jest` with `--coverage`.
         * Building coverage will do after jest close
         */
        if (moment().diff(this.cache[cacheFilePath].using, 'seconds') > 0.5) {
          delete this.cache[cacheFilePath];
          rimraf.sync(cacheFilePath);
          debugLog(`Remove file: ${cacheFilePath}`);
        }
      }
    });

    debugLog(`Cache: ${JSON.stringify(this.cache, null, 2)}`);
  };
}
