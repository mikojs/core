// @flow

// const upperDocument = '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">mikojs</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>';

// const lowerDocument = '</body></html>';

/**
 * @param {string} pathname - pathname
 * @param {string} chunkName - chunk name
 *
 * @return {string} - page
 */
export const getPage = (pathname: string, chunkName: string) => [
  '<main id="__MIKOJS__"><div>',
  'Home',
  '<!-- -->',
  JSON.stringify({ pathname }).replace(/"/g, '&quot;'),
  `<div>${pathname}</div>`,
  '</div></main>',
  '<script data-react-helmet="true">',
  'var __MIKOJS_DATA__ = ',
  JSON.stringify({
    mainInitialProps: {
      value: 'test data',
      name: 'Home',
      pageProps: { pathname },
    },
    pageInitialProps: { pathname },
    chunkName,
  }),
  ';</script>',
];

/**
 * @param {string} pathname - pathname
 * @param {string} chunkName - chunk name
 *
 * @return {string} - not found
 */
export const getNotFound = (pathname: string, chunkName: string) => [
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
    chunkName,
  }),
  ';</script>',
];
