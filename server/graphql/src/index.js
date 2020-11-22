// @flow

import url from 'url';
import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import {
  graphqlHTTP,
  type OptionsData as OptionsDataType,
} from 'express-graphql';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

export type resType = {| json?: (data: mixed) => void |};
export type graphqlType = middlewareType<{}, resType>;

export { buildCache };

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 * @param {OptionsDataType} options - graphql middleware options
 *
 * @return {graphqlType} - graphqlmiddleware
 */
export default (
  folderPath: string,
  prefix?: string,
  options?: $Diff<OptionsDataType, {| schema: mixed |}>,
): graphqlType => {
  const getCache = server.mergeDir<[], cacheType>(
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
