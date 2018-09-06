// @flow

module.exports = [
  // node
  'node_modules',

  // babel
  'lib',

  // flow
  'flow-typed/npm',

  // jest
  'coverage',

  // add checking other configs
  '!.*.js',
].reduce(
  (result: $ReadOnlyArray<string>, ignore: string): $ReadOnlyArray<string> => [
    ...result,
    '--ignore-pattern',
    ignore,
  ],
  [],
);
