// @flow

import normalizedQuestions from '../normalizedQuestions';

it('normalized questions', () => {
  const [{ validate, ...question }] = normalizedQuestions('test')({
    name: 'name',
  });

  expect(question).toEqual({
    name: 'name',
    message: 'name',
    prefix: '{bold {blue ℹ test}}',
    suffix: '{green  ➜}',
  });

  expect(validate('value')).toBeTruthy();
  expect(validate('')).toBe('can not be empty');
});
