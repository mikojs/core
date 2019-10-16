// @flow

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
  : require('./client').default || require('./client');
