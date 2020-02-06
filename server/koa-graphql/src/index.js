// @flow

import { graphql, type GraphQLArgs as GraphQLArgsType } from 'graphql';
import { type makeExecutableSchemaOptionsType } from 'graphql-tools';
import execa, { type ExecaPromise as execaPromiseType } from 'execa';

import buildSchema from './utils/buildSchema';
import updateSchema from './utils/updateSchema';
import buildMiddleware, {
  type optionsType as buildMiddlewareOptionsType,
} from './utils/buildMiddleware';
import getSchemaFilePath from './utils/getSchemaFilePath';

type optionsType = {
  extensions?: RegExp,
  exclude?: RegExp,
  makeExecutableSchemaOptions?: makeExecutableSchemaOptionsType,
};

type returnType = {|
  update: (filePath: string) => void,
  middleware: (
    options?: buildMiddlewareOptionsType,
  ) => $Call<
    typeof buildMiddleware,
    $Call<typeof buildSchema, string, RegExp>,
    buildMiddlewareOptionsType,
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
 * @param {optionsType} options - koa graphql options
 *
 * @return {returnType} - koa graphql functions
 */
export default (folderPath: string, options?: optionsType): returnType => {
  const { extensions = /\.js$/, exclude, makeExecutableSchemaOptions } =
    options || {};
  const schema = buildSchema(
    folderPath,
    extensions,
    exclude,
    makeExecutableSchemaOptions,
  );

  return {
    // update
    update: (filePath: string) =>
      updateSchema(
        folderPath,
        extensions,
        exclude,
        makeExecutableSchemaOptions,
        schema,
        filePath,
      ),

    // middleware
    middleware: (graphqlOptions?: buildMiddlewareOptionsType) =>
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
