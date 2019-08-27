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
  createEnvironment: (relayData?: SSRCacheType, key: string) => EnvironmentType,
} = !process.env.BROWSER
  ? /* istanbul ignore next */
    require('./server').default || require('./server')
  : /* istanbul ignore next */
    require('./client').default || require('./client');`;

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
        // $FlowFixMe wait flow upgrade
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
          // $FlowFixMe wait flow upgrade
          relaySSR.getMiddleware(),
        ]),
      }),
    };
  },
  createEnvironment: (relayData?: SSRCacheType, key: string): Environment => {
    const source = new RecordSource();
    const store = new Store(source);

    return new Environment({
      store,
      network: Network.create(
        () =>
          // $FlowFixMe Flow does not yet support method or property calls in optional chains.
          relayData?.find(
            ([dataKey]: $ElementType<SSRCacheType, number>) => dataKey === key,
          )?.[1],
      ),
    });
  },
};`;

const nodeTemplate = `// @flow

import node from '@cat-org/koa-graphql/lib/schemas/node';

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

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

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
 * @param {mainCtxType} ctx - context from @cat-org/koa-react
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

export const { query } = Home;
export default React.memo<propsType>(Home);`;

const clientTestTemplate = `// @flow

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
      'src/utils/createEnvironment/__tests__/client.js': clientTestTemplate,
      'src/graphql/node.js': nodeTemplate,
      'src/pages/.templates/Main.js': mainTemplate,
      'src/pages/index.js': pageTemplate,
    });

    if (lerna) return;

    await this.execa(
      'yarn add react-is react-relay react-relay-network-modern react-relay-network-modern-ssr relay-runtime node-fetch whatwg-fetch',
      'yarn add --dev babel-plugin-relay',
    );
  };
}

export default new Relay();
