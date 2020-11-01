// @flow

import {
  graphqlHTTP,
  type OptionsData as OptionsDataType,
} from 'express-graphql';

import { type middlewareType } from '@mikojs/server';

import schema from './schema';

type resType = {| json?: (data: mixed) => void |};

/**
 * @param {string} folderPath - folder path
 * @param {OptionsDataType} options - graphql middleware options
 *
 * @return {middlewareType} - router middleware
 */
export default (
  folderPath: string,
  options?: $Diff<OptionsDataType, {| schema: mixed |}>,
): middlewareType<{}, resType> =>
  graphqlHTTP({ ...options, schema: schema(folderPath) });
