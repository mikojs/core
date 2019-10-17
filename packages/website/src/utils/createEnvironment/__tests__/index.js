// @flow

import { fetchQuery, graphql } from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';
import fetchMock from 'fetch-mock';

import client from '../client';
import * as server from '../index';

import { version } from '../../../../package.json';

const query = graphql`
  query clientQuery {
    version
  }
`;
let relayData: SSRCacheType;

fetchMock.mock('*', { data: { version } });

describe('create environment', () => {
  describe('client', () => {
    test.each`
      info
      ${'first'}
      ${'second'}
    `('create environment in the $info time', async () => {
      expect(await fetchQuery(client.createEnvironment(), query)).toEqual({
        version,
      });
    });
  });

  describe('server', () => {
    test('initialize environment before rendering component', async () => {
      if (!server.initEnvironment)
        throw new Error('Can not get initEnvironment from `createEnvironment`');

      const { relaySSR, environment } = server.initEnvironment();

      expect(await fetchQuery(environment, query)).toEqual({ version });

      relayData = await relaySSR.getCache();
    });

    test('mock query when rendering component', async () => {
      expect(
        await fetchQuery(
          server.createEnvironment(
            relayData,
            JSON.stringify({
              queryID: query?.()?.params.name,
              variables: {},
            }),
          ),
          query,
        ),
      ).toEqual({ version });
    });
  });
});
