// @flow

import outputFileSync from 'output-file-sync';

/**
 * @param {string} cacheFilePath - cache file path
 */
export default (cacheFilePath: string) => {
  outputFileSync(
    cacheFilePath,
    `module.exports = (req, res) => {
  res.end(req.url);
}`,
  );
};
