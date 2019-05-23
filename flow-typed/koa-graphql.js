/**
 * https://github.com/chentsulin/koa-graphql/issues/120
 * TODO: remove, fix koa-graphql type error
 *
 * @flow
 */

declare module 'koa-graphql' {
  import type { Middleware as koaMiddlewareType } from 'koa';

  declare type OptionsData = {
    schema: mixed,
    context?: ?mixed,
    rootValue?: ?mixed,
    pretty?: ?boolean,
    formatError?: ?(error: mixed, context?: ?mixed) => mixed,
    validationRules?: ?$ReadOnlyArray<(mixed) => mixed>,
    extensions?: ?(info: mixed) => { [key: string]: mixed },
    graphiql?: ?boolean,
    fieldResolver?: ?mixed,
  };

  declare module.exports: (option: OptionsData) => koaMiddlewareType;
}
