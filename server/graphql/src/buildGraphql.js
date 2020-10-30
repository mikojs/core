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
type graphqlType = (options: optionsType) => Promise<ExecutionResultType>;

/**
 * @param {string} folderPath - folder path
 *
 * @return {graphqlType} - graphql function
 */
export default (folderPath: string): graphqlType =>
  server.mergeDir(
    folderPath,
    undefined,
    buildCache,
  )((cache: cacheType) => (options: optionsType) =>
    graphql({
      ...options,
      schema: makeExecutableSchema(cache),
    }),
  );
