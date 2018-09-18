// @flow

import path from 'path';

import type net from 'net';

import getPort from 'get-port';
import moment from 'moment';

import { Worker } from '../worker';

const cache = {
  filePath: path.resolve(process.cwd(), 'jest.config.js'),
  using: moment().format(),
};
const cacheKeys = [
  {
    cwd: 'cwd',
    argv: [],
  },
  {
    cwd: 'cwd1',
    argv: [],
  },
];

let serverWorker: Worker;
let clientWorker: Worker;
let server: net.Server;

/**
 * @example
 * writeCache({});
 *
 * @param {Object} cacheData - cache data to write
 *
 * @return {Promise} - not return
 */
const writeCache = (cacheData: {}): Promise<void> =>
  new Promise(resolve => {
    clientWorker.writeCache(cacheData).on('end', resolve);
  });

describe('worker', () => {
  beforeAll(async (): void => {
    const port = await getPort();

    serverWorker = new Worker(port);
    clientWorker = new Worker(port);
    server = await serverWorker.init();
  });

  it('can not open second server', async (): void => {
    expect(await clientWorker.init()).toBeNull();
  });

  it('write cache', async (): void => {
    await writeCache({
      ...cache,
      key: cacheKeys[0],
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        keys: [cacheKeys[0]],
        using: cache.using,
      },
    });

    await writeCache({
      ...cache,
      key: cacheKeys[1],
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        keys: cacheKeys,
        using: cache.using,
      },
    });
  });

  it('remove cache but not over 0.5s', async (): void => {
    await writeCache({
      key: cacheKeys[0],
      using: false,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        keys: [cacheKeys[1]],
        using: cache.using,
      },
    });

    await writeCache({
      key: cacheKeys[1],
      using: false,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        keys: [],
        using: cache.using,
      },
    });
  });

  it('update cache time and remove again', async (): void => {
    const newTime = moment()
      .subtract(1, 'seconds')
      .format();

    await writeCache({
      filePath: cache.filePath,
      using: newTime,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        keys: [],
        using: newTime,
      },
    });

    await writeCache({
      key: cacheKeys[1],
      using: false,
    });

    expect(serverWorker.cache).toEqual({});
  });

  it('error when filePath is undefined', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;

    expect(() => {
      serverWorker.writeCache({
        key: cacheKeys[0],
        using: moment().format(),
      });
    }).toThrow('process exit');
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} filePath can not be undefined in worker.writeCache',
    );
  });

  afterAll(async (): void => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });
});
