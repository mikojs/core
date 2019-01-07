// @flow

import fetch, { type Response as ResponseType } from 'node-fetch';

export default async (
  path: string,
  method?: string = 'get',
  options?: {} = {},
): fetch => {
  if (method === 'del')
    return fetch(`http://localhost:8000${path}`, {
      ...options,
      method: 'del',
    }).then((res: ResponseType) => res.text());

  return fetch(`http://localhost:8000${path}`, { ...options, method }).then(
    (res: ResponseType) => res.json(),
  );
};
