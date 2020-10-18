// @flow

export default [
  [
    'add a.js',
    {
      exists: true,
      filePath: 'a.js',
      pathname: '/a',
    },
    `const cache = [{
  filePath: path.resolve(__filename, 'a.js'),
  regExp: pathToRegexp('/a', []),
  getUrlQuery: pathname => match('/a', { decode: decodeURIComponent })(
    pathname,
  ).params,
}];`,
  ],
];
