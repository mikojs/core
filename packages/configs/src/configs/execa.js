// @flow

import npmWhich from 'npm-which';

export default {
  run: (argv: $ReadOnlyArray<string>) => [
    ...argv.slice(0, 1),
    npmWhich(process.cwd()).sync(argv[2]),
    ...argv.slice(3),
  ],
};
