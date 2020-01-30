// @flow

import path from 'path';

import { printSchema } from 'graphql';

import buildSchema from '../buildSchema';

test('build schema', () => {
  expect(
    printSchema(
      buildSchema(path.resolve(__dirname, './__ignore__/schema'), {
        typeDefs: `
          extend type Query {
            foo: String!
          }
        `,
      }),
    ),
  ).toBe(`type Query {
  version: String!
  foo: String!
}
`);
});
