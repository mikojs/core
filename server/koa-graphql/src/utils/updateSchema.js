// @flow

import path from 'path';

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import { addResolveFunctionsToSchema } from 'graphql-tools';
import debug from 'debug';

import { requireModule } from '@mikojs/utils';

import { type optionsType } from '../index';

const debugLog = debug('graphql:updateSchema');

/**
 * @example
 * updateSchema('/folderPath', {}, schema, '/filePath')
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa graphql options
 * @param {GraphQLSchemaType} schema - built schema
 * @param {string} filePath - the file path
 */
export default (
  folderPath: string,
  {
    extensions = /\.js$/,
    exclude,
    makeExecutableSchemaOptions: { resolverValidationOptions } = {},
  }: optionsType,
  schema: GraphQLSchemaType,
  filePath: ?string,
) => {
  if (
    !filePath ||
    !extensions.test(filePath) ||
    exclude?.test(filePath) ||
    !new RegExp(path.resolve(folderPath)).test(filePath)
  )
    return;

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
