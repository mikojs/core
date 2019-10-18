// @flow

import Store from './index';

const template = `// @flow

import type RelaySSRType, {
  SSRCache as SSRCacheType,
} from 'react-relay-network-modern-ssr/node8/server';
import { type Environment as EnvironmentType } from 'relay-runtime';

export const {
  initEnvironment,
  createEnvironment,
}: {
  initEnvironment?: () => {
    relaySSR: RelaySSRType,
    environment: EnvironmentType,
  },
  createEnvironment: (
    relayData?: SSRCacheType,
    key?: string,
  ) => EnvironmentType,
} = !process.env.BROWSER
  ? require('./server').default || require('./server')
  : require('./client').default || require('./client');`;

const clientTemplate = `// @flow

import 'whatwg-fetch';
import {
  RelayNetworkLayer,
  cacheMiddleware,
  urlMiddleware,
} from 'react-relay-network-modern/node8';
import RelaySSR from 'react-relay-network-modern-ssr/node8/client';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';
import { Environment, RecordSource, Store } from 'relay-runtime';

const source = new RecordSource();
const store = new Store(source);

let storeEnvironment: Environment;

export default {
  createEnvironment: (relayData?: SSRCacheType): Environment => {
    if (storeEnvironment) return storeEnvironment;

    storeEnvironment = new Environment({
      store,
      network: new RelayNetworkLayer([
        cacheMiddleware({
          size: 100,
          ttl: 60 * 1000,
        }),
        // $FlowFixMe TODO: wait flow upgrade
        new RelaySSR(relayData).getMiddleware({
          lookup: false,
        }),
        urlMiddleware({
          url: (req: mixed) =>
            \`http://localhost:\${process.env.PORT || '8000'}/graphql\`,
        }),
      ]),
    });

    return storeEnvironment;
  },
};`;

const serverTemplate = `// @flow

import fetch from 'node-fetch';
import {
  RelayNetworkLayer,
  urlMiddleware,
} from 'react-relay-network-modern/node8';
import RelaySSR, {
  type SSRCache as SSRCacheType,
} from 'react-relay-network-modern-ssr/node8/server';
import { Network, Environment, RecordSource, Store } from 'relay-runtime';

global.fetch = fetch;

export default {
  initEnvironment: (): {
    relaySSR: RelaySSR,
    environment: Environment,
  } => {
    const source = new RecordSource();
    const store = new Store(source);
    const relaySSR = new RelaySSR();

    return {
      relaySSR,
      environment: new Environment({
        store,
        network: new RelayNetworkLayer([
          urlMiddleware({
            url: (req: mixed) =>
              \`http://localhost:\${process.env.PORT || '8000'}/graphql\`,
          }),
          // $FlowFixMe TODO: wait flow upgrade
          relaySSR.getMiddleware(),
        ]),
      }),
    };
  },
  createEnvironment: (relayData?: SSRCacheType, key?: string): Environment => {
    const source = new RecordSource();
    const store = new Store(source);

    return new Environment({
      store,
      network: Network.create(
        () =>
          // $FlowFixMe TODO: Flow does not yet support method or property calls in optional chains.
          relayData?.find(
            ([dataKey]: $ElementType<SSRCacheType, number>) => dataKey === key,
          )?.[1],
      ),
    });
  },
};`;

const createEnvironmentTestTemplate = `// @flow

import { fetchQuery, graphql } from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import { version } from '../../../../package.json';

const query = graphql\`
  query Tests_clientQuery {
    version
  }
\`;
let relayData: SSRCacheType;

describe('create environment', () => {
  describe('client', () => {
    beforeAll(() => {
      jest.resetModules();
      process.env.BROWSER = 'true';
    });

    test.each\`
      info
      \${'first'}
      \${'second'}
    \`('create environment in the $info time', async () => {
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
        throw new Error('Can not get initEnvironment from \`createEnvironment\`');

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
              queryID: query?.()?.params.name,
              variables: {},
            }),
          ),
          query,
        ),
      ).toEqual({ version });
    });
  });
});`;

const nodeTemplate = `// @flow

import node from '@mikojs/koa-graphql/lib/schemas/node';

export default node;`;

const mainTemplate = `// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import { isMemo } from 'react-is';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
  type GraphQLTaggedNode as GraphQLTaggedNodeType,
  type Variables as VariablesType,
} from 'react-relay';
import { type SSRCache as SSRCacheType } from 'react-relay-network-modern-ssr/node8/server';

import { type mainCtxType } from '@mikojs/koa-react/lib/types';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type pageComponentType = ComponentType<*> & {|
  query?: GraphQLTaggedNodeType,
  type: {
    query?: GraphQLTaggedNodeType,
  },
|};

type propsType = {|
  variables?: VariablesType,
  relayData?: SSRCacheType,
  Component: pageComponentType,
  children: <P>(props: P) => NodeType,
|};

/** @react control the all page Components */
const Main = ({
  variables = {},
  relayData,
  Component,
  children,
}: propsType): NodeType => {
  const { query } = (!isMemo(Component) ? Component : Component.type) || {};
  const environment = createEnvironment(
    relayData,
    JSON.stringify({
      queryID: query?.()?.params.name,
      variables,
    }),
  );

  return (
    <QueryRenderer
      environment={environment}
      query={query}
      variables={variables}
      render={({ error, props }: ReadyStateType): NodeType => {
        if (error) return <div>{error.message}</div>;

        if (!props) return <div>Loading</div>;

        return children(props);
      }}
    />
  );
};

/**
 * @example
 * Main.getInitialProps(ctx)
 *
 * @param {mainCtxType} ctx - context from @mikojs/koa-react
 *
 * @return {propsType} - initial props
 */
Main.getInitialProps = async ({
  Component,
  pageProps: { variables },
}: mainCtxType<
  {
    variables?: VariablesType,
  },
  {},
  pageComponentType,
>): Promise<$Diff<propsType, { Component: mixed, children: mixed }>> => {
  try {
    const { query } = (!isMemo(Component) ? Component : Component.type) || {};

    if (initEnvironment && query) {
      const { environment, relaySSR } = initEnvironment();

      await fetchQuery(environment, query, variables);

      return {
        variables,
        relayData: await relaySSR.getCache(),
      };
    }
  } catch (e) {
    const { log } = console;

    log(e);
  }

  return {
    variables,
  };
};

export default React.memo<propsType>(Main);`;

const pageTemplate = `// @flow

import React from 'react';
import { graphql } from 'react-relay';

type propsType = {|
  version: string,
|};

/** @react render the home page */
const Home = (props: propsType) => <div>{JSON.stringify(props)}</div>;

Home.query = graphql\`
  query pages_homeQuery {
    version
  }
\`;

export default React.memo<propsType>(Home);`;

const pagesTestTemplate = `// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '@mikojs/koa-react';

import { version } from '../../package.json';

import { createEnvironment } from 'utils/createEnvironment';

const react = new React(path.resolve(__dirname, '../pages'));

jest.mock('utils/createEnvironment', (): {|
  createEnvironment: () => mixed,
|} => {
  const { createMockEnvironment } = jest.requireActual('relay-test-utils');
  const environment = createMockEnvironment();

  return {
    createEnvironment: () => environment,
  };
});

describe('pages', () => {
  test.each\`
    url    | data           | html
    \${'/'} | \${{ version }} | \${\`<div>\${JSON.stringify({ version })}</div>\`}
  \`(
    'page $url',
    async ({ url, data, html }: {| url: string, data: {}, html: string |}) => {
      const wrapper = await react.render(url, {
        Loading: emptyFunction.thatReturnsNull,
      });

      createEnvironment().mock.resolveMostRecentOperation(
        () => ({
          data,
        }),
      );
      wrapper.update();

      expect(wrapper.html()).toBe(html);
    },
  );
});`;

/** relay store */
class Relay extends Store {
  /**
   * @example
   * relay.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({
    useReact,
    useGraphql,
    lerna,
  }: $PropertyType<Store, 'ctx'>) => {
    if (!useReact || !useGraphql) return;

    await this.writeFiles({
      'src/utils/createEnvironment/index.js': template,
      'src/utils/createEnvironment/client.js': clientTemplate,
      'src/utils/createEnvironment/server.js': serverTemplate,
      'src/utils/createEnvironment/__tests__/index.js': createEnvironmentTestTemplate,
      'src/graphql/node.js': nodeTemplate,
      'src/pages/.templates/Main.js': mainTemplate,
      'src/pages/index.js': pageTemplate,
      'src/__tests__/pages.js': pagesTestTemplate,
    });

    if (lerna) return;

    await this.execa(
      'yarn add react-is react-relay react-relay-network-modern react-relay-network-modern-ssr relay-runtime node-fetch whatwg-fetch',
      'yarn add --dev babel-plugin-relay fbjs fetch-mock relay-test-utils',
    );
  };
}

export default new Relay();
