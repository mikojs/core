// @flow

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
              `http://localhost:${process.env.PORT || '8000'}/graphql`,
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
};
