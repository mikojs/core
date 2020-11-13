// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import server from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

/**
 * @param {string} folderPath - folder path
 *
 * @return {GraphQLSchemaType} - graphql schema
 */
export default (
  folderPath: string,
): ((cache: cacheType) => GraphQLSchemaType) =>
  server.mergeDir(folderPath, undefined, buildCache)(makeExecutableSchema);
