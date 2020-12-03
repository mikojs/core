// @flow

import url from 'url';
import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { graphqlHTTP } from 'express-graphql';
import {
  type ASTVisitor,
  type DocumentNode,
  type ValidationRule,
  type ValidationContext,
  type ExecutionArgs,
  type ExecutionResult,
  type GraphQLSchema,
  type GraphQLFieldResolver,
  type GraphQLTypeResolver,
  type GraphQLFormattedError,
  type Source,
  type GraphQLError,
} from 'graphql';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type maybePromiseType<T> = Promise<T> | T;

export type resType = {| json?: (data: mixed) => void |};
export type graphqlType = middlewareType<{}, resType>;
// FIXME: should use express-graphql type
export type optionsType = {|
  context?: mixed,
  rootValue?: mixed,
  pretty?: boolean,
  validationRules?: $ReadOnlyArray<(ctx: ValidationContext) => ASTVisitor>,
  customValidateFn?: (
    schema: GraphQLSchema,
    documentAST: DocumentNode,
    rules: $ReadOnlyArray<ValidationRule>,
  ) => $ReadOnlyArray<GraphQLError>,
  customExecuteFn?: (args: ExecutionArgs) => maybePromiseType<ExecutionResult>,
  customFormatErrorFn?: (error: GraphQLError) => GraphQLFormattedError,
  customParseFn?: (source: Source) => DocumentNode,
  formatError?: (error: GraphQLError) => GraphQLFormattedError,
  extensions?: (
    info: RequestInfo,
  ) => maybePromiseType<?{|
    [string]: mixed,
  |}>,
  graphiql?:
    | boolean
    | {|
        defaultQuery?: string,
        headerEditorEnabled?: boolean,
      |},
  fieldResolver?: GraphQLFieldResolver<mixed, mixed>,
  typeResolver?: GraphQLTypeResolver<mixed, mixed>,
|};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 * @param {optionsType} options - graphql middleware options
 *
 * @return {graphqlType} - graphqlmiddleware
 */
export default (
  folderPath: string,
  prefix?: string,
  options?: optionsType,
): graphqlType => {
  const getCache = server.mergeDir.use<[], cacheType>(
    folderPath,
    undefined,
    buildCache,
  );

  return (req: IncomingMessageType, res: ServerResponseType & resType) => {
    const { pathname } = url.parse(req.url);

    if (
      !pathname ||
      (prefix &&
        !new RegExp(`^${prefix.replace(/^([^/])/, '/$1')}`).test(pathname))
    ) {
      res.statusCode = 404;
      res.end();
      return;
    }

    graphqlHTTP({ ...options, schema: getCache() })(req, res);
  };
};
