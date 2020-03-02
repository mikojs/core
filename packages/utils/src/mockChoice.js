// @flow

/**
 * @example
 * mockChoice(true, () => {}, () => {})
 *
 * @param {boolean} result - determine to use which one
 * @param {Function} funcOne - use when result is true
 * @param {Function} funcTwo - use when result is false
 *
 * @return {Function} result of function
 */
export default <-F>(result: boolean, funcOne: F, funcTwo: F): F =>
  result ? funcOne : funcTwo;
