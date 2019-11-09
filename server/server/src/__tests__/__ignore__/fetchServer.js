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
export default async (
  path: string,
  method?: string = 'get',
  options?: {} = {},
): Promise<string | {}> => {
  if (method === 'del')
    return fetch(`http://localhost:8000${path}`, {
      ...options,
      method: 'del',
    }).then((res: ResponseType) => res.text());

  return fetch(`http://localhost:8000${path}`, {
    ...options,
    method,
  }).then((res: ResponseType) => res.json());
};
