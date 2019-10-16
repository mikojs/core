// @flow

import path from 'path';

import Graphql from '@mikojs/koa-graphql';

import { version } from '../../package.json';

const graphql = new Graphql(path.resolve(__dirname, '../graphql'));

describe('graphql', () => {
  test.each`
    query            | data
    ${'{ version }'} | ${{ version }}
  `(
    'query $query',
    async ({ query, data }: {| query: string, data: mixed |}) => {
      expect(await graphql.query(query)).toEqual({ data });
    },
  );
});
