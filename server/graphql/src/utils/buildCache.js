// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';

import { type fileDataType } from '@mikojs/server';

export type cacheType = GraphQLSchemaType;

const cache: {|
  [string]: string,
|} = {};

/**
 * @param {fileDataType} fileData - file data
 *
 * @return {string} - graphql cache function
 */
export default ({ exists, filePath, pathname }: fileDataType): string => {
  cache[pathname] = filePath;

  if (!exists) delete cache[pathname];

  return `'use strict';

const path = require('path');

const { makeExecutableSchema } = require('@graphql-tools/schema');

const requireModule = require('@mikojs/utils/lib/requireModule');

const schema = makeExecutableSchema([${Object.keys(cache)
    .map(
      (key: string) =>
        `requireModule(path.resolve(__filename, '${cache[key]}'))`,
    )
    .join(', ')}].reduce((result, { typeDefs, ...resolvers }) => ({
  typeDefs: [
    ...result.typeDefs,
    ...(typeDefs instanceof Array ? typeDefs : [typeDefs]),
  ],
  resolvers: Object.keys(resolvers).reduce(
    (prevResolvers, key) => ({
      ...prevResolvers,
      [key]: {
        ...prevResolvers[key],
        ...resolvers[key],
      },
    }),
    result.resolvers,
  ),
}), {
  typeDefs: [],
  resolvers: {},
}));

module.exports = () => schema;`;
};
