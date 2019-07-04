// @flow

/**
 * @example
 * mockChoice(true, () => {}, () => {})
 *
 * @param {boolean} result - determine to use which one
 * @param {function} funcOne - use when result is true
 * @param {function} funcTwo - use when result is false
 *
 * @return {any} result of running function
 */
export default <-A, -R>(
  result: boolean,
  funcOne: (...args: $ReadOnlyArray<A>) => R,
  funcTwo: (...args: $ReadOnlyArray<A>) => R,
  ...args: $ReadOnlyArray<A>
): R => (result ? funcOne(...args) : funcTwo(...args));
