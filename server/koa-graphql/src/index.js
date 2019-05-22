// @flow

import {
  parse,
  buildSchema,
  extendSchema,
  type GraphQLSchema as graphqlSchemaType,
} from 'graphql';
import graphql, {
  type OptionsData as koaGraphqlOptionsType,
} from 'koa-graphql';
import { type Middleware as koaMiddlewareType } from 'koa';

import { d3DirTree } from '@cat-org/utils';
import { type d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

type buildSchemasType = {
  rootValue: $PropertyType<koaGraphqlOptionsType, 'rootValue'>,
  schema: $ReadOnlyArray<string> | graphqlSchemaType,
};

export default (
  folderPath: string,
  options: koaGraphqlOptionsType,
): koaMiddlewareType => {
  const { rootValue, schema } = d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .reduce(
      (
        result: buildSchemasType,
        { data: { path: filePath } }: d3DirTreeNodeType,
      ): buildSchemasType => {
        const { schema: schemaStr, ...rootValueObj } =
          require(filePath).default || require(filePath);
        const newRootValue = {
          ...result.rootValue,
          ...rootValueObj,
        };

        if (
          !/extend type/.test(schemaStr) &&
          !/(type Query|type Mutation)/.test(schemaStr)
        )
          throw new Error(
            `Use schema with \`extend type\` or \`type Query / Mutation\`, but got:\n${schemaStr}`,
          );

        if (result.schema instanceof Array) {
          if (/extend type/.test(schemaStr))
            return {
              rootValue: newRootValue,
              /**
               * https://github.com/facebook/flow/issues/2282
               * instanceof not work
               *
               * $FlowFixMe
               */
              schema: [...result.schema, schemaStr],
            };

          return {
            rootValue: newRootValue,
            /**
             * https://github.com/facebook/flow/issues/2282
             * instanceof not work
             *
             * $FlowFixMe
             */
            schema: result.schema.reduce(
              (rootSchema: graphqlSchemaType, subSchema: string) =>
                extendSchema(rootSchema, parse(subSchema)),
              buildSchema(schemaStr),
            ),
          };
        }

        if (!/extend type/.test(schemaStr))
          throw new Error('There can be only one root schema.');

        return {
          rootValue: newRootValue,
          /**
           * https://github.com/facebook/flow/issues/2282
           * instanceof not work
           *
           * $FlowFixMe
           */
          schema: extendSchema(result.schema, parse(schemaStr)),
        };
      },
      {
        rootValue: {},
        schema: [],
      },
    );

  if (schema instanceof Array)
    throw new Error('There must have one root schema.');

  return graphql({
    ...options,
    schema,
    rootValue,
  });
};
