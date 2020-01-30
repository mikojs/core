// @flow

import path from 'path';

import { printSchema } from 'graphql';

import buildSchema from '../buildSchema';
import updateSchema from '../updateSchema';

const folderPath = path.resolve(__dirname, './__ignore__/schema');
const schema = buildSchema(folderPath);

describe('update schema', () => {
  test.each`
    filePath
    ${'./__ignore__/schemaUpdated/index.js'}
    ${'./notIncludePath.js'}
  `(
    'update schema with file path = $filPath',
    ({ filePath }: {| filePath: string |}) => {
      updateSchema(
        folderPath,
        undefined,
        schema,
        path.resolve(__dirname, filePath),
      );

      expect(printSchema(schema)).toBe(`type Query {
  version: String!
}
`);
    },
  );
});
