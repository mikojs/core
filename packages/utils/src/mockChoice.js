// @flow

export default <-A, -R>(
  result: boolean,
  funcOne: (...args: $ReadOnlyArray<A>) => R,
  funcTwo: (...args: $ReadOnlyArray<A>) => R,
  ...args: $ReadOnlyArray<A>
): R => (result ? funcOne(...args) : funcTwo(...args));
