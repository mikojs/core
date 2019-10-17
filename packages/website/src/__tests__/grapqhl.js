// @flow

import path from 'path';

import Graphql from '@mikojs/koa-graphql';

import { version } from '../../package.json';

const graphql = new Graphql(path.resolve(__dirname, '../graphql'));

describe('graphql', () => {
  test.each`
    source           | data
    ${'{ version }'} | ${{ version }}
  `(
    'query $source',
    async ({ source, data }: {| source: string, data: mixed |}) => {
      expect(await graphql.query({ source })).toEqual({ data });
    },
  );
});
