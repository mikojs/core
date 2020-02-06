// @flow

import path from 'path';

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  addResolveFunctionsToSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import debug from 'debug';

import { requireModule } from '@mikojs/utils';

const debugLog = debug('graphql:updateSchema');

/**
 * @example
 * updateSchema('/folderPath', options, schema, '/filePath')
 *
 * @param {string} folderPath - the folder path
 * @param {RegExp} extensions - file extensions
 * @param {RegExp} exclude - exclude files
 * @param {makeExecutableSchemaOptionsType} options - build schema options
 * @param {GraphQLSchemaType} schema - built schema
 * @param {string} filePath - the file path
 */
export default (
  folderPath: string,
  extensions: RegExp,
  exclude?: RegExp,
  { resolverValidationOptions }: makeExecutableSchemaOptionsType = {},
  schema: GraphQLSchemaType,
  filePath: string,
) => {
  if (!new RegExp(path.resolve(folderPath)).test(filePath)) return;

  const newResolvers = requireModule(filePath);

  debugLog(newResolvers);
  delete newResolvers.typeDefs;

  if (Object.keys(newResolvers).length === 0) return;

  addResolveFunctionsToSchema({
    schema,
    resolvers: newResolvers,
    resolverValidationOptions: {
      ...resolverValidationOptions,
      requireResolversForResolveType: false,
    },
    inheritResolversFromInterfaces: true,
  });
};
