// @flow

import npmWhich from 'npm-which';

export default {
  getCli: (argv: $ReadOnlyArray<string>) =>
    npmWhich(process.cwd()).sync(argv[1]),
  run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => argv.slice(1),
};
