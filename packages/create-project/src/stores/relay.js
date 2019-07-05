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
          url: (req: mixed) => 'http://localhost:8000/graphql',
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
            url: (req: mixed) => 'http://localhost:8000/graphql',
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

export default {
  typeDefs: \`
  # An object with an ID.
  interface Node {
    # ID of the object.
    id: ID!
  }

  # An edge in a connection.
  interface Edge {
    # A cursor for use in pagination.
    cursor: String!

    # The item at the end of the edge.
    node: Node!
  }

  # Look up data listings.
  interface Connection {
    # A list of edges.
    edges: [Edge]!

    # Information to aid in pagination.
    pageInfo: PageInfo!

    # Identifies the total count of items in the connection.
    total: Int!
  }

  # Information about pagination in a connection.
  type PageInfo {
    # When paginating forwards, the cursor to continue.
    endCursor: String

    # When paginating forwards, are there more items?
    hasNextPage: Boolean!

    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean!

    # When paginating backwards, the cursor to continue.
    startCursor: String
  }
\`,
};`;

const mainTemplate = `// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
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
|};

type propsType = {|
  variables?: VariablesType,
  relayData?: SSRCacheType,
  Component: pageComponentType,
  children: <P>(props: P) => NodeType,
|};

/** control the all page Components */
export default class Main extends React.PureComponent<propsType> {
  /**
   * @example
   * Main.getInitialProps(ctx)
   *
   * @param {mainCtxType} ctx - context from @cat-org/koa-react
   *
   * @return {propsType} - initial props
   */
  static getInitialProps = async ({
    Component: { query },
    pageProps: { variables },
  }: mainCtxType<
    {
      variables?: VariablesType,
    },
    {},
    pageComponentType,
  >): Promise<$Diff<propsType, { Component: mixed, children: mixed }>> => {
    try {
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

  /** @react */
  render(): NodeType {
    const { variables = {}, relayData, Component, children } = this.props;
    const environment = createEnvironment(
      relayData,
      JSON.stringify({
        queryID: Component.query ? Component.query().params.name : undefined,
        variables,
      }),
    );

    return (
      <QueryRenderer
        environment={environment}
        query={Component.query}
        variables={variables}
        render={({ error, props }: ReadyStateType): NodeType => {
          if (error) return <div>{error.message}</div>;

          if (!props) return <div>Loading</div>;

          return children(props);
        }}
      />
    );
  }
}`;

const pageTemplate = `// @flow

import React, { type Node as NodeType } from 'react';
import { graphql } from 'react-relay';

/** render the home page */
export default class Home extends React.PureComponent<{| version: string |}> {
  static query = graphql\`
    query pages_homeQuery {
      version
    }
  \`;

  /** @react */
  render(): NodeType {
    return <div>{JSON.stringify(this.props)}</div>;
  }
}`;

const clientTestTemplate = `// @flow

import path from 'path';

import fetch from 'node-fetch';
import { fetchQuery } from 'react-relay';

import server from '@cat-org/server/lib/bin';

import client from '../client';

import Home from 'pages';

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

    expect(await fetchQuery(environment, Home.query)).not.toBeUndefined();
  });

  test('create environment in the second time', async () => {
    const environment = createEnvironment();

    expect(await fetchQuery(environment, Home.query)).not.toBeUndefined();
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
      'yarn add react-relay react-relay-network-modern react-relay-network-modern-ssr relay-runtime node-fetch whatwg-fetch',
      'yarn add --dev babel-plugin-relay',
    );
  };
}

export default new Relay();
