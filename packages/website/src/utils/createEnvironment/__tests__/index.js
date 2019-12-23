// @flow

import { fetchQuery, graphql } from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import { version } from '../../../../package.json';

const query = graphql`
  query Tests_clientQuery {
    version
  }
`;
let relayData: SSRCacheType;

describe('create environment', () => {
  describe('client', () => {
    beforeAll(() => {
      jest.resetModules();
      process.env.BROWSER = 'true';
    });

    test.each`
      info
      ${'first'}
      ${'second'}
    `('create environment in the $info time', async () => {
      const { createEnvironment } = require('../index');
      const fetchMock = require('fetch-mock');

      fetchMock.reset();
      fetchMock.mock('*', { data: { version } });

      expect(await fetchQuery(createEnvironment(), query)).toEqual({
        version,
      });
    });
  });

  describe('server', () => {
    beforeAll(() => {
      jest.resetModules();
      delete process.env.BROWSER;
    });

    test('initialize environment before rendering component', async () => {
      const { initEnvironment } = require('../index');
      const fetchMock = require('fetch-mock');

      fetchMock.reset();
      fetchMock.mock('*', { data: { version } });

      if (!initEnvironment)
        throw new Error('Can not get initEnvironment from `createEnvironment`');

      const { relaySSR, environment } = initEnvironment();

      expect(await fetchQuery(environment, query)).toEqual({ version });

      relayData = await relaySSR.getCache();
    });

    test('mock query when rendering component', async () => {
      const { createEnvironment } = require('../index');
      const fetchMock = require('fetch-mock');

      fetchMock.reset();
      fetchMock.mock('*', { data: { version } });

      expect(
        await fetchQuery(
          createEnvironment(
            relayData,
            JSON.stringify({
              queryID: query?.params.name,
              variables: {},
            }),
          ),
          query,
        ),
      ).toEqual({ version });
    });
  });
});
