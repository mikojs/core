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

import { requireModule } from '@mikojs/utils';
import server, { type middlewareType } from '@mikojs/server';

import buildRouter, { type cacheType } from './utils/buildRouter';

type reqType = IncomingMessageType & {|
  query: QueryParametersType,
|};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {middlewareType} - router middleware
 */
export default (folderPath: string, prefix?: string): middlewareType<> =>
  server.mergeDir(
    folderPath,
    prefix,
    buildRouter,
  )((cache: cacheType): middlewareType<
    reqType,
    ServerResponseType,
  > => (req: reqType, res: ServerResponseType) => {
    const { pathname, query } = url.parse(req.url);
    const router = cache.find(
      ({ regExp }: $ElementType<cacheType, number>) =>
        pathname && regExp.exec(pathname),
    );

    if (!router) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const { filePath, getUrlQuery } = router;

    req.query = {
      ...parse(query || ''),
      ...getUrlQuery(pathname),
    };
    requireModule(filePath)(req, res);
  });
