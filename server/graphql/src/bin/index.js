// @flow

import http from 'http';

import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, { type resType } from '../index';
import { version } from '../../package.json';

(async () => {
  try {
    const result = await parseArgv<{}, resType, []>(
      'graphql',
      (defaultOptions: defaultOptionsType) => ({
        ...defaultOptions,
        version,
        commands: {
          ...defaultOptions.commands,
          'relay-compiler': {
            description: 'create Relay generated files',
          },
        },
      }),
      graphql,
      process.argv,
    );

    if (result instanceof http.Server) return;
  } catch (e) {
    process.exit(1);
  }
})();
