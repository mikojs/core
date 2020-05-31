// @flow

// const upperDocument = '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">mikojs</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>';

// const lowerDocument = '</body></html>';

/**
 * @param {string} basename - basename
 *
 * @return {string} - page
 */
export const getPage = (basename?: string): string => {
  const newPathname = !basename ? '/' : `/${basename}/`;

  return [
    '<main id="__MIKOJS__"><div>',
    'Home',
    '<!-- -->',
    JSON.stringify({ pathname: newPathname }).replace(/"/g, '&quot;'),
    `<div>${newPathname}</div>`,
    '</div></main>',
    '<script data-react-helmet="true">',
    'var __MIKOJS_DATA__ = ',
    JSON.stringify({
      mainInitialProps: {
        value: 'test data',
        name: 'Home',
        pageProps: { pathname: newPathname },
      },
      pageInitialProps: { pathname: newPathname },
      chunkName: !basename ? 'pages/index' : `pages/${basename}`,
    }),
    ';</script>',
  ];
};

/**
 * @param {string} basename - basename
 *
 * @return {string} - not found
 */
export const getNotFound = (basename?: string) => [
  '<main id="__MIKOJS__"><div>',
  'NotFound',
  '<!-- -->{}',
  '<div>Page not found</div>',
  '</div></main>',
  '<script data-react-helmet="true">',
  'var __MIKOJS_DATA__ = ',
  JSON.stringify({
    mainInitialProps: {
      value: 'test data',
      name: 'NotFound',
      pageProps: {},
    },
    pageInitialProps: {},
    chunkName: ['pages', basename, 'notFound'].filter(Boolean).join('/'),
  }),
  ';</script>',
];
