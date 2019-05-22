// @flow

import path from 'path';

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
  schema: graphqlSchemaType,
};

export default (
  folderPath: string,
  rootFile: string,
  options: koaGraphqlOptionsType,
): koaMiddlewareType => {
  const rootPath = path.resolve(folderPath, rootFile);
  const { schema: rootSchemaStr, ...rootSchemaRootValue } = require(rootPath);
  const { rootValue, schema } = d3DirTree(folderPath, {
    extensions: /.jsx?$/,
  })
    .leaves()
    .reduce(
      (
        result: buildSchemasType,
        { data: { path: filePath } }: d3DirTreeNodeType,
      ): buildSchemasType => {
        if (filePath === rootPath) return result;

        const { schema: schemaStr, ...rootValueObj } =
          require(filePath).default || require(filePath);

        return {
          rootValue: {
            ...result.rootValue,
            ...rootValueObj,
          },
          schema: extendSchema(result.schema, parse(schemaStr)),
        };
      },
      {
        rootValue: rootSchemaRootValue,
        schema: buildSchema(rootSchemaStr),
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
