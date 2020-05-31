// @flow

const doctype = '<!DOCTYPE html>';
// const upperDocument = '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">mikojs</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>';

// const lowerDocument = '</body></html>';

/**
 * @return {string} - page
 */
const getPage = () =>
  [
    '<main id="__MIKOJS__"><div>',
    'Home',
    '<!-- -->',
    JSON.stringify({ pathname: '/' }).replace(/"/g, '&quot;'),
    '<div>/</div>',
    '</div></main>',
    '<script data-react-helmet="true">',
    'var __MIKOJS_DATA__ = ',
    JSON.stringify({
      mainInitialProps: {
        value: 'test data',
        name: 'Home',
        pageProps: { pathname: '/' },
      },
      pageInitialProps: { pathname: '/' },
      chunkName: `pages/index`,
    }),
    ';</script>',
  ].join('');

/**
 * @return {string} - not found
 */
const getNotFound = () =>
  [
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
      chunkName: 'pages/notFound',
    }),
    ';</script>',
  ].join('');

export default [
  ['/', [doctype, getPage()].join('')],
  ['/notFound', [doctype, getNotFound()].join('')],
];
