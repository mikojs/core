// @flow

import normalizedQuestions, { defaultValidate } from '../normalizedQuestions';

it('normalized questions', () => {
  const [question] = normalizedQuestions('test')({
    name: 'name',
  });

  expect(question).toEqual({
    name: 'name',
    message: 'name',
    validate: defaultValidate,
    prefix: '{bold {blue ℹ test}}',
    suffix: '{green  ➜}',
  });
});

it('default validate', () => {
  expect(defaultValidate('value')).toBeTruthy();
  expect(defaultValidate('')).toBe('can not be empty');
});
