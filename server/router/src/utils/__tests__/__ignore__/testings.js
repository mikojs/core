// @flow

/**
 * @param {string} filePath - file path
 *
 * @return {string} - cache data
 */
const getCacheData = (filePath: string) => `{
  filePath: path.resolve(__filename, '${filePath.replace(
    /:([\w]+)/,
    '[$1]',
  )}.js'),
  regExp: pathToRegexp('/${filePath}', []),
  getUrlQuery: pathname => match('/${filePath}', { decode: decodeURIComponent })(
    pathname,
  ).params,
}`;

export default [
  [
    'add a.js',
    {
      exists: true,
      filePath: 'a.js',
      pathname: '/a',
    },
    `([${getCacheData('a')}])`,
  ],
  [
    'add a/a.js',
    {
      exists: true,
      filePath: 'a/a.js',
      pathname: '/a/a',
    },
    `([${getCacheData('a/a')}, ${getCacheData('a')}])`,
  ],
  [
    'add [:id].js',
    {
      exists: true,
      filePath: '[id].js',
      pathname: '/:id',
    },
    `([${getCacheData('a/a')}, ${getCacheData('a')}, ${getCacheData(':id')}])`,
  ],
  [
    'remove [:id].js',
    {
      exists: false,
      filePath: '[id].js',
      pathname: '/:id',
    },
    `([${getCacheData('a/a')}, ${getCacheData('a')}])`,
  ],
];
