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

export type routerType = middlewareType<reqType>;

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {routerType} - router middleware
 */
export default (folderPath: string, prefix?: string): routerType => {
  const getCache = server.mergeDir(folderPath, prefix, buildCache);

  return (req: IncomingMessageType & reqType, res: ServerResponseType) => {
    const { pathname, query } = url.parse(req.url);
    const route = getCache().find(
      ({ regExp }: $ElementType<cacheType, number>) =>
        pathname && regExp.exec(pathname),
    );

    if (!route) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const { middleware, method, getUrlQuery } = route;

    if (method && method !== req.method) {
      res.statusCode = 404;
      res.end();
      return;
    }

    req.query = {
      ...parse(query || ''),
      ...getUrlQuery(pathname),
    };
    middleware(req, res);
  };
};
