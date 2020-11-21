#! /usr/bin/env node
// @flow

import http from 'http';

import { printSchema } from 'graphql';
import { relayCompiler } from 'relay-compiler';
import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';

import { handleUnhandledRejection } from '@mikojs/utils';
import server from '@mikojs/server';
import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, { type resType, buildCache } from '../index';

import { version } from '../../package.json';

import relayCompilerCommand from './relayCompiler';

handleUnhandledRejection();

(async () => {
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
  ).catch(() => {
    process.exit(1);
  });

  if (!result || result instanceof http.Server) return;

  const [, sourcePath, config] = result;
  const getCache = server.mergeDir(sourcePath, undefined, buildCache);
  const close = await server.ready();

  relayCompiler({
    ...config,
    schema: printSchema(getCache()),
  });
  close();
})();
