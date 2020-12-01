#! /usr/bin/env node
// @flow

import http from 'http';
import path from 'path';

import { printSchema } from 'graphql';
import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import execa from 'execa';

import { handleUnhandledRejection } from '@mikojs/utils';
import server from '@mikojs/server';
import parseArgv, {
  type defaultOptionsType,
} from '@mikojs/server/lib/parseArgv';

import graphql, {
  type resType,
  type optionsType as graphqlOptionsType,
} from '../index';

import { version } from '../../package.json';

import relayCompilerCommand, { relayCompilerOptionKeys } from './relayCompiler';

import addGraphqlOptions, { graphqlOptionKeys } from 'utils/addGraphqlOptions';
import filterOptions, { type optionsType } from 'utils/filterOptions';
import buildCache, { type cacheType } from 'utils/buildCache';

handleUnhandledRejection();

(async () => {
  const result = await parseArgv<{}, resType, optionsType>(
    'graphql',
    (defaultOptions: defaultOptionsType) =>
      addGraphqlOptions({
        ...defaultOptions,
        version,
        commands: {
          ...defaultOptions.commands,
          'relay-compiler': relayCompilerCommand,
        },
      }),
    (folderPath: string, prefix?: string, options?: optionsType) =>
      graphql(
        folderPath,
        prefix,
        filterOptions<graphqlOptionsType>(options, graphqlOptionKeys),
      ),
    process.argv,
  ).catch(() => {
    process.exit(1);
  });

  if (!result || result instanceof http.Server) return;

  const [command, sourcePath, options] = result;

  if (command !== 'relay-compiler') {
    process.exit(1);
    return;
  }

  const cacheFilePath = findCacheDir({ name: '@mikojs/graphql', thunk: true })(
    'relay-compiler.schema',
  );
  const getCache = server.mergeDir.use<[], cacheType>(
    path.resolve(sourcePath),
    undefined,
    buildCache,
  );
  const close = await server.ready();

  /** */
  const run = () => {
    outputFileSync(cacheFilePath, printSchema(getCache()));
    execa(
      path.resolve(__dirname, './runRelayCompiler.js'),
      [
        JSON.stringify(
          relayCompilerOptionKeys.reduce(
            (relayCompilerOptions: ConfigType, key: string) => ({
              ...relayCompilerOptions,
              [key]: options[key],
            }),
            // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/5332
            ({
              schema: cacheFilePath,
            }: ConfigType),
          ),
        ),
      ],
      { stdio: 'inherit' },
    );
  };

  server.mergeDir.addListener('done', run);

  if (!options.watch) close();
})();
