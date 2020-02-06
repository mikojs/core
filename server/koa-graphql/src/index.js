// @flow

import { graphql, type GraphQLArgs as GraphQLArgsType } from 'graphql';
import { type makeExecutableSchemaOptionsType } from 'graphql-tools';
import execa, { type ExecaPromise as execaPromiseType } from 'execa';

import buildSchema from './utils/buildSchema';
import updateSchema from './utils/updateSchema';
import buildMiddleware, { type optionsType } from './utils/buildMiddleware';
import getSchemaFilePath from './utils/getSchemaFilePath';

type funcsType = {|
  update: (filePath: string) => void,
  middleware: (
    options?: optionsType,
  ) => $Call<
    typeof buildMiddleware,
    $Call<typeof buildSchema, string, RegExp>,
    optionsType,
  >,
  runRelayCompiler: (argv: $ReadOnlyArray<string>) => execaPromiseType,
  query: (
    graphQLArgs: $Diff<GraphQLArgsType, { schema: mixed }>,
  ) => $Call<typeof graphql, GraphQLArgsType>,
|};

/**
 * @example
 * graphql('/folderPath')
 *
 * @param {string} folderPath - the folder path
 * @param {RegExp} extensions - file extensions
 * @param {RegExp} exclude - exclude files
 * @param {makeExecutableSchemaOptionsType} options - build schema options
 *
 * @return {funcsType} - koa graphql functions
 */
export default (
  folderPath: string,
  extensions?: RegExp = /\.js$/,
  exclude?: RegExp,
  options?: makeExecutableSchemaOptionsType,
): funcsType => {
  const schema = buildSchema(folderPath, extensions, exclude, options);

  return {
    // update
    update: (filePath: string) =>
      updateSchema(folderPath, extensions, exclude, options, schema, filePath),

    // middleware
    middleware: (graphqlOptions?: optionsType) =>
      buildMiddleware(schema, graphqlOptions),

    // run relay-compiler
    runRelayCompiler: (argv: $ReadOnlyArray<string>) =>
      execa(
        'relay-compiler',
        ['--schema', getSchemaFilePath(schema), ...argv],
        {
          stdio: 'inherit',
        },
      ),

    // query
    query: (graphQLArgs: $Diff<GraphQLArgsType, { schema: mixed }>) =>
      graphql({
        ...graphQLArgs,
        schema,
      }),
  };
};
