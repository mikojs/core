// @flow

import fetch, { type Response as ResponseType } from 'node-fetch';

/**
 * @example
 * fetchServer('/')
 *
 * @param {string} path - require path
 * @param {string} method - require method
 * @param {object} options - require options
 *
 * @return {any} - require data
 */
export default async (path: string, method?: string = 'get', options?: mixed) =>
  fetch(`http://localhost:8000${path}`, {
    ...options,
    method,
  }).then((res: ResponseType) => (method === 'del' ? res.text() : res.json()));
