// @flow

const head =
  '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">cat-org</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>';

/**
 * @example
 * modifyDoubleQuotes({ key: value })
 *
 * @param {object} data - object data
 *
 * @return {string} - data string
 */
const modifyDoubleQuotes = (data: {}): string =>
  JSON.stringify(data).replace(/"/g, '&quot;');

export default [
  ['/', 'pages/index', head, '/', { path: '/' }, {}],
  ['/?key=value', 'pages/index', head, '/', { path: '/' }, {}],
  [
    '/otherPath',
    'pages/otherPath',
    head,
    '/otherPath',
    { path: '/otherPath' },
    {},
  ],
  [
    '/otherFolder/otherFolder',
    'pages/otherFolder/otherFolder/index',
    head,
    '/otherFolder/otherFolder',
    { path: '/otherFolder/otherFolder' },
    {},
  ],
  [
    '/aaaa',
    'pages/[foo(aaaa)]',
    head,
    `/aaaa<!-- -->-<!-- -->${modifyDoubleQuotes({
      foo: 'aaaa',
    })}`,
    {
      path: '/aaaa',
      params: {
        foo: 'aaaa',
      },
    },
    {},
  ],
  [
    '/bbbb/aaaa',
    'pages/[bar]/[foo]',
    head,
    `/bbbb/aaaa<!-- -->-<!-- -->${modifyDoubleQuotes({
      bar: 'bbbb',
      foo: 'aaaa',
    })}`,
    {
      path: '/bbbb/aaaa',
      params: {
        bar: 'bbbb',
        foo: 'aaaa',
      },
    },
    {},
  ],
  [
    '/otherFolder/aaaa',
    'pages/otherFolder/[foo]',
    head,
    `/otherFolder/aaaa<!-- -->-<!-- -->${modifyDoubleQuotes({
      foo: 'aaaa',
    })}`,
    {
      path: '/otherFolder/aaaa',
      params: {
        foo: 'aaaa',
      },
    },
    {},
  ],
  [
    '/otherFolder/otherFolder/aaaa',
    'pages/otherFolder/otherFolder/[foo]',
    head,
    `/otherFolder/otherFolder/aaaa<!-- -->-<!-- -->${modifyDoubleQuotes({
      foo: 'aaaa',
    })}`,
    {
      path: '/otherFolder/otherFolder/aaaa',
      params: {
        foo: 'aaaa',
      },
    },
    {},
  ],
  [
    '/custom/',
    'pages/custom/index',
    '',
    `Home<!-- -->${modifyDoubleQuotes({
      test: 'value',
    })}<div>test data<!-- -->-<!-- -->value</div>`,
    {
      test: 'value',
    },
    {
      value: 'test data',
      name: 'Home',
      pageProps: {
        test: 'value',
      },
    },
  ],
  [
    '/error',
    'pages/error',
    head,
    '<div><h1>😞😱🔨 Error</h1><p>custom error</p><p></p></div>',
    {},
    {},
  ],
  [
    '/custom/error',
    'pages/custom/error',
    '',
    'custom error',
    {},
    {
      value: 'test data',
      name: 'ErrorComponent',
      pageProps: {},
    },
  ],
  [
    '/notFound',
    'pages/notFound',
    '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">404 | Page not found</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>',
    '<h1>404</h1><h2>Page not found</h2>',
    {},
    {},
  ],
  [
    '/custom/notFound',
    'pages/custom/notFound',
    '',
    'NotFound<!-- -->{}<div>Page not found</div>',
    {},
    {
      value: 'test data',
      name: 'NotFound',
      pageProps: {},
    },
  ],
];
