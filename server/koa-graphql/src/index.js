// @flow

import path from 'path';

import { printSchema, type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  addResolveFunctionsToSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import graphql, {
  type OptionsData as koaGraphqlOptionsType,
} from 'koa-graphql';
import execa, { ThenableChildProcess as ThenableChildProcessType } from 'execa';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import chokidar from 'chokidar';
import debug from 'debug';

import { d3DirTree, requireModule } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

type buildSchemasType = {
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  resolvers: $PropertyType<makeExecutableSchema, 'resolvers'>,
};

export type optionsType = buildSchemasType & {
  dev?: boolean,
  options?: makeExecutableSchemaOptionsType,
};

const debugLog = debug('graphql');

/** koa-graphql */
export default class Graphql {
  schema: GraphQLSchemaType;

  /**
   * @example
   * new Graphql('folder path')
   *
   * @param {string} folderPath - folder path
   * @param {options} options - make executable schema options
   */
  constructor(
    folderPath: string,
    {
      dev = true,
      typeDefs: additionalTypeDefs,
      resolvers: additionalResolvers,
      options = {},
    }: optionsType = {},
  ) {
    const { typeDefs, resolvers } = d3DirTree(folderPath, {
      extensions: /.jsx?$/,
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

    if (dev)
      chokidar
        .watch(folderPath, {
          ignoreInitial: true,
        })
        .on('change', (filePath: string) => {
          if (!/\.jsx?$/.test(filePath)) return;

          const newResolvers = requireModule(filePath);

          delete newResolvers.typeDefs;

          addResolveFunctionsToSchema({
            schema: this.schema,
            resolvers: newResolvers,
            resolverValidationOptions: {
              ...options.requireResolversForResolveType,
              requireResolversForResolveType: false,
            },
            inheritResolversFromInterfaces: true,
          });
        });

    this.schema = makeExecutableSchema({
      ...options,
      resolverValidationOptions: {
        ...options.requireResolversForResolveType,
        requireResolversForResolveType: false,
      },
      typeDefs,
      resolvers,
    });
  }

  /**
   * @example
   * graphql.relay(['--src', './src'])
   *
   * @param {Array} argv - argv for relay-compiler
   *
   * @return {process} - child process
   */
  +relay = (argv: $ReadOnlyArray<string>): ThenableChildProcessType => {
    const schemaFilePath = path.resolve(
      findCacheDir({ name: 'koa-graphql' }),
      './schema.graphql',
    );

    debugLog(schemaFilePath);
    outputFileSync(schemaFilePath, printSchema(this.schema));

    return execa('relay-compiler', ['--schema', schemaFilePath, ...argv], {
      stdio: 'inherit',
    });
  };

  /**
   * @example
   * graphql.middleware()
   *
   * @param {options} options - koa graphql options
   *
   * @return {Function} - koa-graphql middleware
   */
  +middleware = (options?: $Diff<koaGraphqlOptionsType, { schema: mixed }>) =>
    graphql({
      ...options,
      schema: this.schema,
    });
}
