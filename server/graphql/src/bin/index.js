#! /usr/bin/env node
// @flow

import http from 'http';

import { relayCompiler } from 'relay-compiler';
import { type Config } from 'relay-compiler/bin/RelayCompilerMain.js.flow';

import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, { type resType } from '../index';
import { version } from '../../package.json';

(async () => {
  try {
    const result = await parseArgv<{}, resType, ['relay-compiler', Config]>(
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

    if (!result || result instanceof http.Server) return;

    relayCompiler(result[1]);
  } catch (e) {
    process.exit(1);
  }
})();
