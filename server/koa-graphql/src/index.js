// @flow

import { graphql, type GraphQLArgs as GraphQLArgsType } from 'graphql';
import { type makeExecutableSchemaOptionsType } from 'graphql-tools';

import buildSchema from './utils/buildSchema';
import updateSchema from './utils/updateSchema';
import buildMiddleware, { type optionsType } from './utils/buildMiddleware';

type funcsType = {|
  update: (filePath: string) => void,
  middleware: (
    options?: optionsType,
  ) => $Call<
    typeof buildMiddleware,
    $Call<typeof buildSchema, string>,
    optionsType,
  >,
  query: (
    graphQLArgs: $Diff<GraphQLArgsType, { schema: mixed }>,
  ) => $Call<typeof graphql, GraphQLArgsType>,
|};

/**
 * @example
 * graphql('/folderPath')
 *
 * @param {string} folderPath - the folder path
 * @param {makeExecutableSchemaOptionsType} options - build schema options
 *
 * @return {funcsType} - koa graphql functions
 */
export default (
  folderPath: string,
  options?: makeExecutableSchemaOptionsType,
): funcsType => {
  const schema = buildSchema(folderPath, options);

  return {
    // update
    update: (filePath: string) =>
      updateSchema(folderPath, options, schema, filePath),

    // middleware
    middleware: (graphqlOptions?: optionsType) =>
      buildMiddleware(schema, graphqlOptions),

    // query
    query: (graphQLArgs: $Diff<GraphQLArgsType, { schema: mixed }>) =>
      graphql({
        ...graphQLArgs,
        schema,
      }),
  };
};
