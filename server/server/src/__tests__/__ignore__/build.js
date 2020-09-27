// @flow

/**
 * @return {string} - middleware cache
 */
export default () => `module.exports = (req, res) => {
  res.end(req.url);
};`;
