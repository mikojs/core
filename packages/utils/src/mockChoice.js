// @flow

export default <ArgType, ResultType>(
  result: boolean,
  funcOne: (...args: $ReadOnlyArray<ArgType>) => ResultType,
  funcTwo: (...args: $ReadOnlyArray<ArgType>) => ResultType,
  ...args: $ReadOnlyArray<ArgType>
): ResultType => (result ? funcOne(...args) : funcTwo(...args));
