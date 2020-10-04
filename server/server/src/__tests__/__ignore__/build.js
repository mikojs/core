// @flow

/**
 * @return {string} - middleware cache
 */
export default (): string => `module.exports = (req, res) => {
  res.end(req.url);
};`;
