// @flow

import { error } from './pages/error';

/**
 * @param {string} title - title
 *
 * @return {string} - title
 */
const getHead = (title?: string = 'mikojs') =>
  [
    '<head>',
    '<meta data-react-helmet="true" charSet="utf-8"/>',
    '<meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/>',
    `<title data-react-helmet="true">${title}</title>`,
    '<link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/>',
    '</head>',
  ].join('');

/**
 * @param {string} head - head
 * @param {string} content - content
 * @param {object} data - mikojs data
 *
 * @return {string} - content
 */
const getContent = (head: string, content: string, data: {}) =>
  [
    '<!DOCTYPE html><html lang="en">',
    head,
    '<body>',
    '<main id="__MIKOJS__">',
    content,
    '</main>',
    '<script data-react-helmet="true">',
    'var __MIKOJS_DATA__ = ',
    JSON.stringify(data),
    ';</script></body></html>',
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
    !isDefaultTemplates ? '' : getHead(),
    `<div>Home<!-- -->:<!-- -->${pathname}</div>`,
    {
      mainInitialProps: !isDefaultTemplates ? { name: 'Home' } : {},
      pageInitialProps: { pathname },
      chunkName,
    },
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
    !isDefaultTemplates ? '' : getHead(),
    `<div>Key<!-- -->:<!-- -->${JSON.stringify({ key: 'value' }).replace(
      /"/g,
      '&quot;',
    )}</div>`,
    {
      mainInitialProps: !isDefaultTemplates ? { name: 'Key' } : {},
      pageInitialProps: {
        params: {
          key: 'value',
        },
      },
      chunkName,
    },
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
    !isDefaultTemplates ? '' : getHead('404 | Page not found'),
    '<div><h1>404</h1><h2>Page not found</h2></div>',
    {
      mainInitialProps: !isDefaultTemplates ? { name: 'NotFound' } : {},
      pageInitialProps: {},
      chunkName,
    },
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
  getContent(
    !isDefaultTemplates ? '' : getHead(),
    [
      '<div><div><h1>😞😱🔨 Error</h1>',
      `<p>${error.message}</p>`,
      !isDefaultTemplates
        ? ''
        : error.stack
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .split(/\n/)
            .map((text: string) => `<p>${text}</p>`)
            .join(''),
      '</div></div>',
      `<script>var errorProps = { error: new Error(&#x27;${
        error.message
      }&#x27;), errorInfo: { componentStack: &#x27;${error.stack
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}&#x27; } }
if (!__MIKOJS_DATA__) var __MIKOJS_DATA__ = { errorProps };
else __MIKOJS_DATA__.errorProps = errorProps;</script>`,
    ].join(''),
    {
      mainInitialProps: !isDefaultTemplates ? { name: 'ErrorPage' } : {},
      pageInitialProps: {},
      chunkName,
    },
  );
