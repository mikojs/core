// @flow

import {
  graphql,
  type GraphQLArgs as GraphQLArgsType,
  type ExecutionResult as ExecutionResultType,
} from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import server from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type optionsType = $Diff<GraphQLArgsType, { schema: mixed }>;
type queryType = (
  folderPath: string,
) => (options: optionsType) => Promise<ExecutionResultType>;

export default {
  set: server.set,
  ready: server.ready,

  /**
   * @param {string} folderPath - folder path
   *
   * @return {queryType} - query function
   */
  build: (folderPath: string): queryType =>
    server.mergeDir(
      folderPath,
      undefined,
      buildCache,
    )((cache: cacheType) => (options: optionsType) =>
      graphql({
        ...options,
        schema: makeExecutableSchema(cache),
      }),
    ),
};
