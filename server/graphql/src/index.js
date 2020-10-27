// @flow

import {
  type IncomingMessage as IncomingMessageType,
  type ServerResponse as ServerResponseType,
} from 'http';

import {
  graphqlHTTP,
  type OptionsData as OptionsDataType,
} from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type resType = ServerResponseType & {| json?: (data: mixed) => void |};

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 * @param {OptionsDataType} options - graphql middleware options
 *
 * @return {middlewareType} - router middleware
 */
export default (
  folderPath: string,
  prefix?: string,
  options?: $Diff<OptionsDataType, {| schema: mixed |}>,
): middlewareType<> =>
  server.mergeDir(
    folderPath,
    prefix,
    buildCache,
  )((cache: cacheType): middlewareType<IncomingMessageType, resType> =>
    graphqlHTTP({ ...options, schema: makeExecutableSchema(cache) }),
  );
