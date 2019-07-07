// @flow

import { type optionsType } from '@cat-org/koa-graphql';

import typeDefs from './typeDefs';
import resolvers from './resolvers';

/**
 * @example
 * useDnd({})
 *
 * @param {optionsType} config - prev @cat-org/koa-graphql config
 *
 * @return {optionsType} - @cat-org/koa-graphql config
 */
export default ({
  typeDefs: prevTypeDefs = [],
  resolvers: prevResolvers = {},
  ...options
}: optionsType): optionsType => ({
  ...options,
  typeDefs: [...prevTypeDefs, typeDefs],
  resolvers: {
    ...prevResolvers,
    ...resolvers,
  },
});
