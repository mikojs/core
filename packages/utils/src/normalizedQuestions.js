// @flow

import chalk from 'chalk';

type validateType<ValueType> = (val: ValueType & string) => true | string;
type questionType<ValueType> = {
  name: string,
  message?: string,
  validate?: validateType<ValueType>,
};

/**
 * @example
 * defaultValidate('')
 *
 * @param {string} val - input value
 *
 * @return {boolean} - validate result
 */
export const defaultValidate = (val: string) =>
  val !== '' || 'can not be empty';

export default (projectName: string) => <ValueType>(
  ...questions: $ReadOnlyArray<questionType<ValueType>>
) =>
  (questions.map(
    ({
      name,
      message = name,
      validate = defaultValidate,
      ...question
    }: questionType<ValueType>) => ({
      ...question,
      name,
      message,
      validate,
      prefix: chalk`{bold {gray • ${projectName}}}`,
      suffix: chalk`{green  ➜}`,
    }),
  ): $ReadOnlyArray<{
    name: string,
    message: string,
    validate: validateType<ValueType>,
    prefix: string,
    suffix: string,
  }>);
