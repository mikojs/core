// @flow

it('can not import @cat-org/configs', () => {
  expect(() => {
    require('..');
  }).toThrowError(
    'Do not import module with `@cat-org/configs`. Use `@cat-org/configs/lib/<module>`.',
  );
});
