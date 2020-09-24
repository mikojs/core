// @flow

import outputFileSync from 'output-file-sync';

import { type watcherType } from './buildWatcher';

/**
 * @param {string} foldePath - folder path
 * @param {watcherType} watcher - watcher object
 * @param {string} cacheFilePath - cache file path
 */
export default async (
  foldePath: string,
  watcher: watcherType,
  cacheFilePath: string,
) => {
  await watcher('capabilityCheck', {
    optional: [],
    required: ['relative_root'],
  });

  outputFileSync(
    cacheFilePath,
    `module.exports = (req, res) => {
  res.end(req.url);
};`,
  );
};
