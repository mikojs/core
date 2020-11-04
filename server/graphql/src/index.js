// @flow

import {
  graphqlHTTP,
  type OptionsData as OptionsDataType,
} from 'express-graphql';

import { type middlewareType } from '@mikojs/server';

import schema from './schema';

type resType = {| json?: (data: mixed) => void |};

export type graphqlType = middlewareType<{}, resType>;

/**
 * @param {string} folderPath - folder path
 * @param {OptionsDataType} options - graphql middleware options
 *
 * @return {graphqlType} - graphqlmiddleware
 */
export default (
  folderPath: string,
  options?: $Diff<OptionsDataType, {| schema: mixed |}>,
): graphqlType => graphqlHTTP({ ...options, schema: schema(folderPath) });
