// @flow

import {
  makeExecutableSchema,
  type makeExecutableSchemaOptionsType,
} from 'graphql-tools';
import graphql, {
  type OptionsData as koaGraphqlOptionsType,
} from 'koa-graphql';
import { type Middleware as koaMiddlewareType } from 'koa';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

type buildSchemasType = {
  typeDefs: $PropertyType<makeExecutableSchemaOptionsType, 'typeDefs'>,
  resolvers: $PropertyType<makeExecutableSchema, 'resolvers'>,
};

export default (
  folderPath: string,
  options?: koaGraphqlOptionsType,
  makeExecutableSchemaOptions?: makeExecutableSchemaOptionsType,
): koaMiddlewareType => {
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

  return graphql({
    ...options,
    schema: makeExecutableSchema({
      ...makeExecutableSchemaOptions,
      typeDefs,
      resolvers,
    }),
  });
};
