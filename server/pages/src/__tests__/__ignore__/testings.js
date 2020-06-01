// @flow

// const upperDocument = '<html lang="en"><head><meta data-react-helmet="true" charSet="utf-8"/><meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/><title data-react-helmet="true">mikojs</title><link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/></head><body>';

// const lowerDocument = '</body></html>';

/**
 * @param {string} name - page name
 * @param {object} pageProps - page props
 * @param {string} content - page content
 * @param {string} chunkName - chunk name
 *
 * @return {string} - content
 */
const getContent = (
  name: string,
  pageProps: {},
  content: string,
  chunkName: string,
) =>
  [
    '<!DOCTYPE html>',
    '<main id="__MIKOJS__"><div>',
    name,
    '<!-- -->',
    JSON.stringify(pageProps).replace(/"/g, '&quot;'),
    content,
    '</div></main>',
    '<script data-react-helmet="true">',
    'var __MIKOJS_DATA__ = ',
    JSON.stringify({
      mainInitialProps: {
        value: 'test data',
        name,
        pageProps,
      },
      pageInitialProps: pageProps,
      chunkName,
    }),
    ';</script>',
  ].join('');

/**
 * @param {string} chunkName - chunk name
 * @param {string} pathname - pathname
 *
 * @return {string} - page
 */
export const getPage = (chunkName: string, pathname: string) =>
  getContent('Home', { pathname }, `<div>${pathname}</div>`, chunkName);

/**
 * @param {string} chunkName - chunk name
 *
 * @return {string} - not found
 */
export const getNotFound = (chunkName: string) =>
  getContent('NotFound', {}, '<div>Page not found</div>', chunkName);

/**
 * @param {string} chunkName - chunk name
 *
 * @return {string} - not found
 */
export const getValue = (chunkName: string) =>
  getContent(
    'Key',
    {
      params: {
        key: 'value',
      },
    },
    `<div>${JSON.stringify({ key: 'value' }).replace(/"/g, '&quot;')}</div>`,
    chunkName,
  );
