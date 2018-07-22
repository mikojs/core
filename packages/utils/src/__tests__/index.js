// @flow

it('can not import @cat-org/utils', () => {
  expect(() => {
    require('..');
  }).toThrowError(
    'Do not import module with `@cat-org/utils`. Use `@cat-org/utils/lib/<module>`.',
  );
});
