// @flow

import Store from './index';

const template = `// @flow

export const { initEnvironment, createEnvironment } = !process.env.BROWSER
  ? require('./server')
  : require('./client');`;

const clientTemplate = `// @flow

import 'whatwg-fetch';
import {
  RelayNetworkLayer,
  cacheMiddleware,
  urlMiddleware,
} from 'react-relay-network-modern/node8';
import RelaySSR from 'react-relay-network-modern-ssr/node8/client';
import { Environment, RecordSource, Store } from 'relay-runtime';

const source = new RecordSource();
const store = new Store(source);

let storeEnvironment: Environment;

export default {
  createEnvironment: (relayData: mixed): Environment => {
    if (storeEnvironment) return storeEnvironment;

    storeEnvironment = new Environment({
      store,
      network: new RelayNetworkLayer([
        cacheMiddleware({
          size: 100,
          ttl: 60 * 1000,
        }),
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
import RelaySSR from 'react-relay-network-modern-ssr/node8/server';
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
          relaySSR.getMiddleware(),
        ]),
      }),
    };
  },
  createEnvironment: (relayData: mixed, key: string): Environment => {
    const source = new RecordSource();
    const store = new Store(source);

    return new Environment({
      store,
      network: Network.create(
        () => relayData.find(([dataKey]: [string]) => dataKey === key)[1],
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
\`
};`;

const mainTemplate = `// @flow

import React, { type Node as NodeType } from 'react';
import {
  QueryRenderer,
  fetchQuery,
  type ReadyState as ReadyStateType,
} from 'react-relay';

import { type mainCtxType } from '@cat-org/koa-react/lib/types';

import { initEnvironment, createEnvironment } from 'utils/createEnvironment';

type propsType = {|
  queryID: string,
  variables: mixed,
  relayData: mixed,
|};

export default class Main extends React.PureComponent<
  propsType & {| children: NodeType |},
> {
  static getInitialProps = async ({
    Component: { query },
    pageProps: { variables = {} },
  }: mainCtxType<>): propsType => {
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
    const { Component, variables, relayData, children } = this.props;
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
    });

    if (lerna) return;

    await this.execa(
      'yarn add react-relay react-relay-network-modern react-relay-network-modern-ssr relay-runtime node-fetch whatwg-fetch',
    );
  };
}

export default new Relay();
