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
  const cacheDir = findCacheDir({ name: '@mikojs/graphql', thunk: true });
  const cacheFilePath = cacheDir('relay-compiler.schema');
  const getCache = server.mergeDir(
    path.resolve(sourcePath),
    undefined,
    buildCache,
  );
  const close = await server.ready();

  outputFileSync(cacheFilePath, printSchema(getCache()));
  relayCompiler({
    ...config,
    schema: cacheFilePath,
  });
  close();
})();
