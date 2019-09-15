// @flow

import path from 'path';

import fetch from 'node-fetch';
import { fetchQuery, graphql } from 'react-relay';

import server from '@mikojs/server/lib/defaults';

import client from '../client';

const { createEnvironment } = client;
const query = graphql`
  query clientQuery {
    version
  }
`;
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
