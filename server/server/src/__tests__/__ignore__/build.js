// @flow

import path from 'path';

import server, { type middlewareType } from '../..';

/**
 * @param {string} folderPath - folder path
 *
 * @return {middlewareType} - middleware function
 */
export default (folderPath: string) =>
  server.create(
    () => `module.exports = (req, res) => {
  res.end(req.url);
};`,
  )(path.resolve(__dirname, folderPath));
