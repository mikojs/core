// @flow

import path from 'path';

import fetch from 'node-fetch';
import { fetchQuery } from 'react-relay';

import server from '@cat-org/server/lib/defaults';

import client from '../client';

import { query } from 'pages';

const { createEnvironment } = client;
let runningServer: http$Server;

global.fetch = fetch;

describe('client', () => {
  beforeAll(async () => {
    runningServer = await server({
      src: path.resolve(__dirname, '../../..'),
      dir: path.resolve(__dirname, '../../..'),
    });
  });

  test('create environment in the first time', async () => {
    const environment = createEnvironment();

    expect(await fetchQuery(environment, query)).not.toBeUndefined();
  });

  test('create environment in the second time', async () => {
    const environment = createEnvironment();

    expect(await fetchQuery(environment, query)).not.toBeUndefined();
  });

  afterAll(() => {
    runningServer.close();
  });
});
