// @flow

export default <Arg, Result>(
  result: boolean,
  funcOne: (...args: $ReadOnlyArray<Arg>) => Result,
  funcTwo: (...args: $ReadOnlyArray<Arg>) => Result,
  ...args: $ReadOnlyArray<Arg>
): Result => (result ? funcOne(...args) : funcTwo(...args));
