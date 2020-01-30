// @flow

import {
  type IncomingMessage as incomingMessageType,
  type ServerResponse as serverResponseType,
} from 'http';

import { type Context as koaContextType } from 'koa';
import { type GraphQLSchema as GraphQLSchemaType } from 'graphql';
import graphqlHTTP, {
  type OptionsData as expressGraphqlOptionsType,
} from 'express-graphql';
import compose from 'koa-compose';
import bodyparser from 'koa-bodyparser';

type ctxType = {
  ...koaContextType,
  request: incomingMessageType & {|
    body: mixed,
  |},
  res: serverResponseType & {| json?: ?(data: mixed) => void |},
};

export type optionsType = $Diff<expressGraphqlOptionsType, { schema: mixed }>;

/**
 * @example
 * buildMiddleware(schema)
 *
 * @param {GraphQLSchemaType} schema - built schema
 * @param {expressGraphqlOptionsType} options - http options
 *
 * @return {Function} - koa middleware
 */
export default (schema: GraphQLSchemaType, options: ?optionsType) =>
  compose([
    bodyparser(),
    async (ctx: ctxType, next: () => Promise<void>) => {
      ctx.res.statusCode = 200;
      await graphqlHTTP({
        ...options,
        schema,
      })(ctx.request, ctx.res);
    },
  ]);
