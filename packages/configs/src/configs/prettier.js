// @flow

import { type Options as OptionsType } from 'prettier';

export default {
  install: (install: $ReadOnlyArray<string>) => [...install, 'prettier'],
  config: (): OptionsType => ({
    singleQuote: true,
    trailingComma: 'all',
  }),
  run: (argv: $ReadOnlyArray<string>) => [...argv, '--write'],
};
