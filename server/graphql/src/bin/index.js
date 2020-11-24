#! /usr/bin/env node
// @flow

import http from 'http';
import path from 'path';

import { printSchema } from 'graphql';
import { relayCompiler } from 'relay-compiler';
import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import { handleUnhandledRejection } from '@mikojs/utils';
import server from '@mikojs/server';
import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, { type resType } from '../index';

import { version } from '../../package.json';

import relayCompilerCommand, {
  defaultRelayCompilerOptions,
} from './relayCompiler';

import buildCache, { type cacheType } from 'utils/buildCache';

handleUnhandledRejection();

(async () => {
  const result = await parseArgv<{}, resType, ConfigType>(
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

  // FIXME: flow could not use `delete config.port`, `delete config.prefix`
  // eslint-disable-next-line no-unused-vars
  const [, sourcePath, { port, prefix, ...config }] = result;
  const cacheFilePath = findCacheDir({ name: '@mikojs/graphql', thunk: true })(
    'relay-compiler.schema',
  );
  const getCache = server.mergeDir<[], cacheType>(
    path.resolve(sourcePath),
    undefined,
    buildCache,
  );
  const close = await server.ready();

  Object.keys(defaultRelayCompilerOptions).forEach((key: string) => {
    config[key] = config[key] || defaultRelayCompilerOptions[key];
  });

  outputFileSync(cacheFilePath, printSchema(getCache()));
  relayCompiler({
    ...config,
    schema: cacheFilePath,
  });
  close();
})();
