// @flow

import filterOptions from '../filterOptions';

test('filter options', () => {
  const expected = {
    watchman: false,
    verbose: false,
    validate: false,
    src: 'src',
    schema: 'schema',
    repersist: false,
    quiet: false,
    noFutureProofEnums: false,
    language: 'javascript',
    include: [],
    exclude: [],
    extensions: [],
  };

  expect(filterOptions(expected, [...Object.keys(expected), 'key'])).toEqual(
    expected,
  );
});
