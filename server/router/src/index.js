// @flow

import server, { type middlewareType } from '@mikojs/server';

import buildRouter from './utils/buildRouter';

/**
 * @param {string} folderPath - folder path
 * @param {string} prefix - pathname prefix
 *
 * @return {middlewareType} - router middleware
 */
export default (folderPath: string, prefix?: string): middlewareType =>
  server.use(folderPath, prefix, buildRouter);
