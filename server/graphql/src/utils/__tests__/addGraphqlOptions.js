// @flow

import addGraphqlOptions, { newOptions } from '../addGraphqlOptions';

test('add graphql options', () => {
  const defaultCommand = {
    description: 'description',
  };
  const options = addGraphqlOptions({
    ...defaultCommand,
    name: 'graphql',
    version: '1.0.0',
    commands: {
      dev: defaultCommand,
      start: defaultCommand,
      build: defaultCommand,
    },
  });

  expect(options.commands?.dev.options).toEqual(newOptions);
});
