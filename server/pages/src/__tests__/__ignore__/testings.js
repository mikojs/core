// @flow

import { error } from './pages/error';

/**
 * @param {string} name - page name
 * @param {object} pageProps - page props
 * @param {string} content - page content
 * @param {string} chunkName - chunk name
 * @param {boolean} isDefaultTemplates - is default templates or not
 *
 * @return {string} - content
 */
const getContent = (
  name: string,
  pageProps: {},
  content: string,
  chunkName: string,
  isDefaultTemplates: boolean,
) =>
  [
    '<!DOCTYPE html>',
    ...(!isDefaultTemplates
      ? []
      : [
          '<html lang="en"><head>',
          '<meta data-react-helmet="true" charSet="utf-8"/>',
          '<meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/>',
          '<title data-react-helmet="true">mikojs</title>',
          '<link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/>',
          '</head><body>',
        ]),
    '<main id="__MIKOJS__">',
    ...(!isDefaultTemplates
      ? [
          '<div>',
          name,
          '<!-- -->',
          JSON.stringify(pageProps).replace(/"/g, '&quot;'),
          content,
          '</div>',
        ]
      : [content]),
    '</main>',
    '<script data-react-helmet="true">',
    'var __MIKOJS_DATA__ = ',
    JSON.stringify({
      mainInitialProps: !isDefaultTemplates
        ? {
            value: 'test data',
            name,
            pageProps,
          }
        : {},
      pageInitialProps: pageProps,
      chunkName,
    }),
    ';</script>',
    ...(!isDefaultTemplates ? [] : ['</body></html>']),
  ].join('');

/**
 * @param {string} chunkName - chunk name
 * @param {string} pathname - pathname
 * @param {boolean} isDefaultTemplates - is default templates or not
 *
 * @return {string} - page
 */
export const getPage = (
  chunkName: string,
  pathname: string,
  isDefaultTemplates: boolean,
) =>
  getContent(
    'Home',
    { pathname },
    `<div>${pathname}</div>`,
    chunkName,
    isDefaultTemplates,
  );

/**
 * @param {string} chunkName - chunk name
 * @param {string} pathname - pathname
 * @param {boolean} isDefaultTemplates - is default templates or not
 *
 * @return {string} - value page
 */
export const getValue = (
  chunkName: string,
  pathname: string,
  isDefaultTemplates: boolean,
) =>
  getContent(
    'Key',
    {
      params: {
        key: 'value',
      },
    },
    `<div>${JSON.stringify({ key: 'value' }).replace(/"/g, '&quot;')}</div>`,
    chunkName,
    isDefaultTemplates,
  );

/**
 * @param {string} chunkName - chunk name
 * @param {string} pathname - pathname
 * @param {boolean} isDefaultTemplates - is default templates or not
 *
 * @return {string} - not found page
 */
export const getNotFound = (
  chunkName: string,
  pathname: string,
  isDefaultTemplates: boolean,
) =>
  getContent(
    'NotFound',
    {},
    '<div>Page not found</div>',
    chunkName,
    isDefaultTemplates,
  );

/**
 * @param {string} chunkName - chunk name
 * @param {string} pathname - pathname
 * @param {boolean} isDefaultTemplates - is default templates or not
 *
 * @return {string} - value page
 */
export const getError = (
  chunkName: string,
  pathname: string,
  isDefaultTemplates: boolean,
) =>
  getContent('ErrorPage', {}, '', chunkName, isDefaultTemplates).replace(
    /<main id="__MIKOJS__">.*<\/main>/,
    `<main id="__MIKOJS__">${
      !isDefaultTemplates
        ? '<div>error</div>'
        : [
            '<div><div><h1>😞😱🔨 Error</h1>',
            `<p>${error.message}</p>`,
            error.stack
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .split(/\n/)
              .map((text: string) => `<p>${text}</p>`)
              .join(''),
            '</div></div>',
          ].join('')
    }<script>var errorProps = { error: new Error(&#x27;${
      error.message
    }&#x27;), errorInfo: { componentStack: &#x27;${error.stack
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}&#x27; } }
if (!__MIKOJS_DATA__) var __MIKOJS_DATA__ = { errorProps };
else __MIKOJS_DATA__.errorProps = errorProps;</script></main>`,
  );
