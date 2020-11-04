// @flow

import {
  graphqlHTTP,
  type OptionsData as OptionsDataType,
} from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import server, { type middlewareType } from '@mikojs/server';

import buildCache, { type cacheType } from './utils/buildCache';

type resType = {| json?: (data: mixed) => void |};

export type graphqlType = middlewareType<{}, resType>;

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
): graphqlType =>
  server.mergeDir(
    folderPath,
    prefix,
    buildCache,
  )((cache: cacheType): graphqlType =>
    graphqlHTTP({ ...options, schema: makeExecutableSchema(cache) }),
  );
