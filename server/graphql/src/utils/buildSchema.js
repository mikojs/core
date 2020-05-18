// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import debug from 'debug';

import { requireModule, mergeDir } from '@mikojs/utils';
import {
  type mergeDirEventType,
  type mergeDirDataType,
} from '@mikojs/utils/lib/mergeDir';
import { type optionsType as serverOptionsType } from '@mikojs/server';

export type optionsType = {|
  ...serverOptionsType,
  makeExecutableSchemaOptions: makeExecutableSchemaOptionsType,
|};

type cacheType = {|
  resolvers: $PropertyType<makeExecutableSchemaOptionsType, 'resolvers'>,
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  cache?: GraphQLSchemaType,
|};

const debugLog = debug('graphql:buildSchema');

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - build schema options
 *
 * @return {cacheType} - schema cache
 */
export default (
  folderPath: string,
  {
    dev,
    logger,
    makeExecutableSchemaOptions: {
      typeDefs: additionalTypeDefs = [],
      resolvers: additionalResolvers = {},
      resolverValidationOptions,
      ...makeExecutableSchemaOptions
    },
    ...options
  }: optionsType,
): cacheType => {
  const cache: cacheType = {
    typeDefs:
      additionalTypeDefs instanceof Array
        ? additionalTypeDefs
        : [additionalTypeDefs],
    resolvers: additionalResolvers,
  };

  debugLog(cache);
  mergeDir(
    folderPath,
    {
      ...options,
      watch: dev,
      extensions: /\.js$/,
    },
    (event: mergeDirEventType, { filePath }: mergeDirDataType) => {
      const { typeDefs, ...resolvers } = requireModule<{
        [string]: $PropertyType<cacheType, 'resolvers'>,
        typeDefs: $PropertyType<cacheType, 'typeDefs'>,
      }>(filePath);

      debugLog({ typeDefs, resolvers });

      switch (event) {
        case 'init':
          cache.typeDefs = [...cache.typeDefs, typeDefs];
          Object.keys(resolvers).forEach((resolverName: string) => {
            cache.resolvers[resolverName] = {
              ...cache.resolvers[resolverName],
              ...resolvers[resolverName],
            };
          });
          break;

        default:
          break;
      }

      debugLog(cache);
    },
  );
  cache.cache = makeExecutableSchema({
    ...makeExecutableSchema,
    resolverValidationOptions: {
      ...resolverValidationOptions,
      requireResolversForResolveType: false,
    },
    typeDefs: cache.typeDefs,
    resolvers: cache.resolvers,
  });

  return cache;
};
