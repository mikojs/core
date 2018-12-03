// @flow

import chalk from 'chalk';

type validateType = (val: string) => boolean | string;
type questionType = {
  name: string,
  message?: string,
  validate?: validateType,
};

/**
 * @example
 * defaultValidate('')
 *
 * @param {string} val - input value
 *
 * @return {boolean} - validate result
 */
const defaultValidate: validateType = (val: string) =>
  val !== '' || 'can not be empty';

export default (projectName: string) => (
  ...questions: $ReadOnlyArray<questionType>
) =>
  (questions.map(
    ({
      name,
      message = name,
      validate = defaultValidate,
      ...question
    }: questionType) => ({
      ...question,
      name,
      message,
      validate,
      prefix: chalk`{bold {blue ℹ ${projectName}}}`,
      suffix: chalk`{green  ➜}`,
    }),
  ): $ReadOnlyArray<{
    name: string,
    message: string,
    validate: validateType,
    prefix: string,
    suffix: string,
  }>);
