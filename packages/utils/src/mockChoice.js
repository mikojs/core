// @flow

export default (
  result: boolean,
  funcOne: (...args: $ReadOnlyArray<string>) => mixed,
  funcTwo: (...args: $ReadOnlyArray<string>) => mixed,
  ...args: $ReadOnlyArray<string>
) => (result ? funcOne(...args) : funcTwo(...args));
