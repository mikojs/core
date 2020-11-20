#! /usr/bin/env node
// @flow

import http from 'http';

import { printSchema } from 'graphql';
import { relayCompiler } from 'relay-compiler';
import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';

import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, { type resType } from '../index';
import buildSchema, { type schemaType } from '../buildSchema';

import { version } from '../../package.json';

import relayCompilerCommand from './relayCompiler';

(async () => {
  try {
    const result = await parseArgv<
      {},
      resType,
      ['relay-compiler', string, ConfigType],
    >(
      'graphql',
      (defaultOptions: defaultOptionsType) => ({
        ...defaultOptions,
        version,
        commands: {
          ...defaultOptions.commands,
          'relay-compiler': relayCompilerCommand,
        },
      }),
      graphql,
      process.argv,
    );

    if (!result || result instanceof http.Server) return;

    const [, sourcePath, config] = result;

    buildSchema(sourcePath, (schema: schemaType) => {
      relayCompiler({
        ...config,
        schema: printSchema(schema),
      });
    });
  } catch (e) {
    process.exit(1);
  }
})();
