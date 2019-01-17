// @flow

import path from 'path';
import { type Server as ServerType } from 'net';

import getPort from 'get-port';
import moment from 'moment';

import { Worker, type cacheType } from '../worker';

const cache = {
  filePath: path.resolve('jest.config.js'),
  using: moment()
    .add(5, 'seconds')
    .format(),
};

let serverWorker: Worker;
let clientWorker: Worker;
let server: ServerType;

/**
 * @example
 * writeCache({});
 *
 * @param {Object} cacheData - cache data to write
 *
 * @return {Promise} - not return
 */
const writeCache = async (cacheData: cacheType) => {
  await new Promise(resolve => {
    /* eslint-disable flowtype/no-unused-expressions */
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    clientWorker.writeCache(cacheData)?.on('end', resolve);
    /* eslint-enable flowtype/no-unused-expressions */
  });
};

describe('worker', () => {
  beforeAll(async () => {
    const port = await getPort();

    serverWorker = new Worker(port);
    clientWorker = new Worker(port);
    // $FlowFixMe Flow does not yet support method or property calls in optional chains.
    server = await serverWorker?.init();
  });

  test('can not open second server', async () => {
    expect(await clientWorker.init()).toBeNull();
  });

  test('write cache', async () => {
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

  test('remove cache but not over 0.5s', async () => {
    serverWorker.writeCache({
      pid: 1,
      using: false,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [2],
        using: cache.using,
      },
    });

    serverWorker.writeCache({
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

  test('update cache time and remove again', async () => {
    const newTime = moment()
      .subtract(1, 'seconds')
      .format();

    serverWorker.writeCache({
      filePath: cache.filePath,
      using: newTime,
    });

    expect(serverWorker.cache).toEqual({
      [cache.filePath]: {
        pids: [],
        using: newTime,
      },
    });

    serverWorker.writeCache({
      pid: 2,
      using: false,
    });

    expect(serverWorker.cache).toEqual({});
  });

  test('error when filePath is undefined', () => {
    expect(() => {
      serverWorker.writeCache({
        pid: 1,
        using: moment().format(),
      });
    }).toThrow('process exit');
  });

  test('error when try to use client remove cache', () => {
    expect(() => {
      clientWorker.writeCache({
        pid: 1,
        using: false,
      });
    }).toThrow('process exit');
  });

  afterAll(async () => {
    await new Promise(resolve => {
      server.close(resolve);
    });
  });
});
