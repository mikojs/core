// @flow

import url from 'url';
import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import {
  parse,
  type QueryParameters as QueryParametersType,
} from 'query-string';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type reqType = {|
  query: QueryParametersType,
|};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {middlewareType} - router middleware
 */
export default (folderPath: string, prefix?: string): middlewareType<reqType> =>
  server.mergeDir(
    folderPath,
    prefix,
    buildCache,
  )(
    (cache: cacheType) => (
      req: IncomingMessageType & reqType,
      res: ServerResponseType,
    ) => {
      const { pathname, query } = url.parse(req.url);
      const route = cache.find(
        ({ regExp }: $ElementType<cacheType, number>) =>
          pathname && regExp.exec(pathname),
      );

      if (!route) {
        res.statusCode = 404;
        res.end();
        return;
      }

      const { middleware, getUrlQuery } = route;

      req.query = {
        ...parse(query || ''),
        ...getUrlQuery(pathname),
      };
      middleware(req, res);
    },
  );
