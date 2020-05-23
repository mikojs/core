// @flow

import graphql, {
  type OptionsData as expressGraphqlOptionsType,
} from 'express-graphql';

import { notFound, type middlewareType } from '@mikojs/server';

import buildSchema, {
  type optionsType as buildSchemaOptionsType,
} from './utils/buildSchema';

type optionsType = {|
  ...buildSchemaOptionsType,
  graphqlOptions?: expressGraphqlOptionsType,
|};

type returnType = {|
  middleware: middlewareType<>,
|};

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): returnType => {
  const { graphqlOptions, ...buildSchemaOptions } = options;
  const schema = buildSchema(folderPath, buildSchemaOptions);

  return {
    middleware: async (req: http.IncomingMessage, res: http.ServerResponse) => {
      if (!schema.cache) {
        notFound(req, res);
        return;
      }

      await graphql({
        ...graphqlOptions,
        schema: schema.cache,
      })(req, res);
      res.statusCode = 200;
    },
  };
};
