// @flow

import path from 'path';

import { printSchema, type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import debug from 'debug';

const debugLog = debug('graphql:getSchemaFilePath');

/**
 * @example
 * getSchemaFilePath(schema)
 *
 * @param {GraphQLSchemaType} schema - built schema
 *
 * @return {string} - schema file path
 */
export default (schema: GraphQLSchemaType): string => {
  const schemaFilePath = path.resolve(
    findCacheDir({ name: 'koa-graphql' }),
    './schema.graphql',
  );

  debugLog(schemaFilePath);
  outputFileSync(schemaFilePath, printSchema(schema));

  return schemaFilePath;
};
