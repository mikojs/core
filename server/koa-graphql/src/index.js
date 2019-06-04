// @flow

import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import graphql, {
  type OptionsData as koaGraphqlOptionsType,
} from 'koa-graphql';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

type buildSchemasType = {
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  resolvers: $PropertyType<makeExecutableSchema, 'resolvers'>,
};

/** koa-graphql */
export default class Graphql {
  schema: GraphQLSchemaType;

  /**
   * @example
   * new Graphql('folder path')
   *
   * @param {string} folderPath - folder path
   * @param {Object} options - make executable schema options
   */
  constructor(folderPath: string, options?: makeExecutableSchemaOptionsType) {
    const { typeDefs, resolvers } = d3DirTree(folderPath, {
      extensions: /.jsx?$/,
    })
      .leaves()
      .reduce(
        (
          result: buildSchemasType,
          { data: { path: filePath } }: d3DirTreeNodeType,
        ): buildSchemasType => {
          const { typeDefs: newTypeDefs, ...newResolvers } =
            require(filePath).default || require(filePath);

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
          typeDefs: [],
          resolvers: {},
        },
      );

    this.schema = makeExecutableSchema({
      ...options,
      typeDefs,
      resolvers,
    });
  }

  /**
   * @example
   * graphql.middleware()
   *
   * @param {Object} options - koa graphql options
   *
   * @return {Function} - koa-graphql middleware
   */
  +middleware = (options?: koaGraphqlOptionsType) =>
    graphql({
      ...options,
      schema: this.schema,
    });
}
