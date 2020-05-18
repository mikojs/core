// @flow

import graphqlHTTP, {
  type OptionsData as expressGraphqlOptionsType,
} from 'express-graphql';

import { notFound, type middlewareType } from '@mikojs/server';

import buildSchema, {
  type optionsType as buildSchemaOptionsType,
} from './utils/buildSchema';

type optionsType = {|
  ...buildSchemaOptionsType,
  graphqlOptions: expressGraphqlOptionsType,
|};

/**
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 *
 * @return {middlewareType} - middleware function
 */
export default (
  folderPath: string,
  { graphqlOptions, ...options }: optionsType = {},
): middlewareType<> => {
  const schema = buildSchema(folderPath, options);

  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!schema.cache) {
      notFound(req, res);
      return;
    }

    await graphqlHTTP({
      ...graphqlOptions,
      schema: schema.cache,
    })(req, res);
    res.statusCode = 200;
  };
};
