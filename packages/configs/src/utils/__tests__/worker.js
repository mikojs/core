// @flow

import path from 'path';

import type net from 'net';

import getPort from 'get-port';
import moment from 'moment';

import { Worker } from '../worker';

import type { cacheType } from '../worker';

const cache = {
  filePath: path.resolve(process.cwd(), 'jest.config.js'),
  using: moment().format(),
};

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
const writeCache = async (cacheData: cacheType): Promise<void> => {
  await new Promise(resolve => {
    /* eslint-disable flowtype/no-unused-expressions */
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    clientWorker.writeCache(cacheData)?.on('end', resolve);
    /* eslint-enable flowtype/no-unused-expressions */
  });
};

describe('worker', () => {
  beforeAll(async (): Promise<void> => {
    const port = await getPort();

    serverWorker = new Worker(port);
    clientWorker = new Worker(port);
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    server = await serverWorker?.init();
  });

  it('can not open second server', async (): Promise<void> => {
    expect(await clientWorker.init()).toBeNull();
  });

  it('write cache', async (): Promise<void> => {
    await writeCache({
      ...cache,
      pid: 1,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [1],
        using: cache.using,
      },
    });

    await writeCache({
      ...cache,
      pid: 2,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [1, 2],
        using: cache.using,
      },
    });
  });

  it('remove cache but not over 0.5s', async (): Promise<void> => {
    await writeCache({
      pid: 1,
      using: false,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [2],
        using: cache.using,
      },
    });

    await writeCache({
      pid: 2,
      using: false,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [],
        using: cache.using,
      },
    });
  });

  it('update cache time and remove again', async (): Promise<void> => {
    const newTime = moment()
      .subtract(1, 'seconds')
      .format();

    await writeCache({
      filePath: cache.filePath,
      using: newTime,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [],
        using: newTime,
      },
    });

    await writeCache({
      pid: 2,
      using: false,
    });

    expect(serverWorker.cache).toEqual({});
  });

  it('error when filePath is undefined', () => {
    const mockLog = jest.fn();

    global.console.log = mockLog;

    expect(() => {
      serverWorker.writeCache({
        pid: 1,
        using: moment().format(),
      });
    }).toThrow('process exit');
    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockLog).toHaveBeenCalledWith(
      '  {red configs-scripts} filePath can not be undefined in worker.writeCache',
    );
  });

  afterAll(async (): Promise<void> => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });
});
