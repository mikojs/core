// @flow

import watchman from 'fb-watchman';
import outputFileSync from 'output-file-sync';

import { type watcherType } from './buildWatcher';

/**
 * @param {string} foldePath - folder path
 * @param {watcherType} watcher - watcher object
 * @param {string} cacheFilePath - cache file path
 *
 * @return {Function} - close client
 */
export default async (
  foldePath: string,
  watcher: watcherType,
  cacheFilePath: string,
): Promise<() => void> => {
  const client = new watchman.Client();

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

  return () => {
    client.end();
  };
};
