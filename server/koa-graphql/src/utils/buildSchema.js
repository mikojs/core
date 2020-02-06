// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import debug from 'debug';

import { d3DirTree, requireModule } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

type buildSchemasType = {
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  resolvers: $PropertyType<makeExecutableSchemaOptionsType, 'resolvers'>,
};

const debugLog = debug('graphql:buildSchema');

/**
 * @example
 * buildSchema('/folderPath')
 *
 * @param {string} folderPath - folder path
 * @param {RegExp} extensions - file extensions
 * @param {RegExp} exclude - exclude files
 * @param {makeExecutableSchemaOptionsType} options - schema option
 *
 * @return {GraphQLSchemaType} - graphql schema
 */
export default (
  folderPath: string,
  extensions: RegExp,
  exclude?: RegExp,
  {
    typeDefs: additionalTypeDefs,
    resolvers: additionalResolvers,
    resolverValidationOptions,
    ...options
  }: makeExecutableSchemaOptionsType = {},
): GraphQLSchemaType => {
  const { typeDefs, resolvers } = d3DirTree(folderPath, {
    extensions: extensions,
    exclude,
  })
    .leaves()
    .reduce(
      (
        result: buildSchemasType,
        { data: { path: filePath } }: d3DirTreeNodeType,
      ): buildSchemasType => {
        const { typeDefs: newTypeDefs, ...newResolvers } = requireModule(
          filePath,
        );

        return {
          typeDefs: [...result.typeDefs, newTypeDefs],
          resolvers: Object.keys(newResolvers).reduce(
            (
              prevResolvers: $PropertyType<buildSchemasType, 'resolvers'>,
              resolverName: string,
            ) => ({
              ...prevResolvers,
              [resolverName]: {
                ...prevResolvers[resolverName],
                ...newResolvers[resolverName],
              },
            }),
            result.resolvers,
          ),
        };
      },
      {
        typeDefs:
          additionalTypeDefs instanceof Array || !additionalTypeDefs
            ? additionalTypeDefs || []
            : [additionalTypeDefs],
        resolvers: additionalResolvers || {},
      },
    );

  debugLog({
    typeDefs,
    resolvers,
  });

  return makeExecutableSchema({
    ...options,
    resolverValidationOptions: {
      ...resolverValidationOptions,
      requireResolversForResolveType: false,
    },
    typeDefs,
    resolvers,
  });
};
