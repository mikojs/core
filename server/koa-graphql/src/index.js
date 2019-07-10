// @flow

import path from 'path';

import { type Context as koaContextType } from 'koa';
import { printSchema, type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  addResolveFunctionsToSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import execa, { ThenableChildProcess as ThenableChildProcessType } from 'execa';
import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';
import compose from 'koa-compose';
import bodyparser from 'koa-bodyparser';
import debug from 'debug';

import { d3DirTree, requireModule } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import graphql, {
  type OptionsData as expressGraphqlOptionsType,
} from 'express-graphql';

type buildSchemasType = {
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  resolvers: $PropertyType<makeExecutableSchemaOptionsType, 'resolvers'>,
};

export type optionsType = buildSchemasType & {
  typeDefs?: $PropertyType<buildSchemasType, 'typeDefs'>,
  resolvers?: $PropertyType<buildSchemasType, 'resolvers'>,
  options?: makeExecutableSchemaOptionsType,
};

const debugLog = debug('graphql');

/** koa-graphql */
export default class Graphql {
  schema: GraphQLSchemaType;
  options: $PropertyType<optionsType, 'options'>;

  /**
   * @example
   * new Graphql('folder path')
   *
   * @param {string} folderPath - folder path
   * @param {optionsType} options - make executable schema options
   */
  constructor(
    folderPath: string,
    {
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

    this.options = options;
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
   * graphql.update('/file-path')
   *
   * @param {string} filePath - file path
   */
  update = (filePath: string) => {
    const newResolvers = requireModule(filePath);

    delete newResolvers.typeDefs;

    addResolveFunctionsToSchema({
      schema: this.schema,
      resolvers: newResolvers,
      resolverValidationOptions: {
        ...this.options?.requireResolversForResolveType,
        requireResolversForResolveType: false,
      },
      inheritResolversFromInterfaces: true,
    });
  };

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
   * @param {expressGraphqlOptionsType} options - koa graphql options
   *
   * @return {Function} - koa-graphql middleware
   */
  +middleware = (
    options?: $Diff<expressGraphqlOptionsType, { schema: mixed }>,
  ) =>
    compose([
      bodyparser(),
      async (ctx: koaContextType, next: () => Promise<void>) => {
        // $FlowFixMe remove after express-graphql publish
        ctx.req.body = ctx.request.body;

        await graphql({
          ...options,
          schema: this.schema,
        })(
          // $FlowFixMe remove after express-graphql publish
          ctx.req,
          // $FlowFixMe remove after express-graphql publish
          ctx.res,
        );
      },
    ]);
}
