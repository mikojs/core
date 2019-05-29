// @flow

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
          url: (req: mixed) => process.env.RELAY_ENDPOINT,
        }),
      ]),
    });

    return storeEnvironment;
  },
};
