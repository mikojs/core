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
        // $FlowFixMe https://github.com/relay-tools/react-relay-network-modern-ssr/pull/14
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
          // $FlowFixMe https://github.com/relay-tools/react-relay-network-modern-ssr/pull/14
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
  interface Node {
    id: ID!
  }

  interface edge {
    cursor: String!
  }

  interface Connection {
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
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

import {
  initEnvironment,
  createEnvironment,
} from '../../utils/createEnvironment';

type pageComponentType = ComponentType<*> & {|
  query?: GraphQLTaggedNodeType,
|};

type propsType = {|
  variables: VariablesType,
  relayData?: SSRCacheType,
  Component: pageComponentType,
  children: <P>(props: P) => NodeType,
|};

export default class Main extends React.PureComponent<propsType> {
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
      if (initEnvironment) {
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

  render(): NodeType {
    const { variables, relayData, Component, children } = this.props;
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

export default class Home extends React.PureComponent<{| version: string |}> {
  static query = graphql\`
    query pages_homeQuery {
      version
    }
  \`;

  render(): NodeType {
    return (
       <div>{JSON.stringify(this.props)}</div>
    );
  }
}`;

/** relay store */
class Relay extends Store {
  /**
   * @example
   * relay.end(ctx)
   *
   * @param {Object} ctx - store context
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
      'src/graphql/node.js': nodeTemplate,
      'src/pages/.templates/Main.js': mainTemplate,
      'src/pages/index.js': pageTemplate,
    });

    if (lerna) return;

    await this.execa(
      'yarn add react-relay react-relay-network-modern react-relay-network-modern-ssr relay-runtime node-fetch whatwg-fetch',
    );
  };
}

export default new Relay();
