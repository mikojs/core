// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import { graphqlHTTP } from 'express-graphql';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type resType = ServerResponseType & {| json?: (data: mixed) => void |};

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
    buildCache,
  )((cache: cacheType): middlewareType<IncomingMessageType, resType> =>
    graphqlHTTP({ schema: cache }),
  );
