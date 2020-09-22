// @flow

import http, { type Server as ServerType } from 'http';

import { type callbackType } from './types';
import buildMiddleware from './index';

/**
 * @param {string} folderPath - folder path
 * @param {number} port - server port
 * @param {callbackType} callback - callback function to handle file
 *
 * @return {ServerType} - server object
 */
export default (folderPath: string, port: number, callback: callbackType) =>
  http.createServer(buildMiddleware(folderPath, callback)).listen(port);
