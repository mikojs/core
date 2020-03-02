// @flow

/**
 * @example
 * mockChoice(true, mixed, mixed)
 *
 * @param {boolean} result - determine to use which one
 * @param {any} one - use when result is true
 * @param {any} two - use when result is false
 *
 * @return {any} result choicing
 */
export default <-V>(result: boolean, one: V, two: V): V => (result ? one : two);
