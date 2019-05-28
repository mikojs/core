// @flow

export const head =
  '<html><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">cat-org</title></head><body>';

export default [
  ['/', 'pages/index', head, '/', { path: '/' }],
  ['/?key=value', 'pages/index', head, '/', { path: '/' }],
  ['/otherPath', 'pages/otherPath', head, '/otherPath', { path: '/otherPath' }],
  [
    '/otherFolder/otherFolder',
    'pages/otherFolder/otherFolder/index',
    head,
    '/otherFolder/otherFolder',
    { path: '/otherFolder/otherFolder' },
  ],
  ['/custom/', 'pages/custom/index', '', 'test data', {}],
  [
    '/error',
    'pages/error',
    head,
    '<div><h1>😞😱🔨 Error</h1><p>custom error</p><p></p></div>',
    {},
  ],
  ['/custom/error', 'pages/custom/error', '', 'custom error', {}],
  [
    '/notFound',
    'pages/notFound',
    '<html><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">404 | Page not found</title></head><body>',
    '<h1>404</h1><h2>Page not found</h2>',
    {},
  ],
  ['/custom/notFound', 'pages/custom/notFound', '', 'Page not found', {}],
];
