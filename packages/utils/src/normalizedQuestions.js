// @flow

import chalk from 'chalk';

type questionType<T> = {
  name: string,
  message?: string,
  validate?: (val: T & string) => true | string,
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

export default (projectName: string) => <T>(
  ...questions: $ReadOnlyArray<questionType<T>>
) =>
  (questions.map(
    ({
      name,
      message = name,
      validate = defaultValidate,
      ...question
    }: questionType<T>) => ({
      ...question,
      name,
      message,
      validate,
      prefix: chalk`{bold {gray • ${projectName}}}`,
      suffix: chalk`{green  ➜}`,
    }),
  ): $ReadOnlyArray<{|
    name: string,
    message: string,
    validate: $PropertyType<questionType<T>, 'validate'>,
    prefix: string,
    suffix: string,
  |}>);
