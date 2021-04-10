import commander from '@mikojs/commander';

import { version } from '../package.json';

import getCommandStr from './getCommandStr';

const transform = ({ action, ...config }, callback) => ({
  ...config,
  allowUnknownOption: true,
  action: (...args) => {
    const program = args.find(
      arg => typeof arg !== 'string' && !(arg instanceof Array),
    );

    callback(
      getCommandStr(
        [
          typeof action === 'string' ? action : action?.(program.opts()),
          ...program.args,
        ].filter(Boolean),
      ),
    );
  },
  commands: Object.keys(config.commands || {}).reduce(
    (result, key) => ({
      ...result,
      [key]: transform(config.commands[key], callback),
    }),
    {},
  ),
});

export default config => argv =>
  new Promise(resolve =>
    commander(
      transform(
        {
          ...config,
          name: 'miko',
          version,
          description: 'Use a simple config to manage commands.',
          arguments: '<args...>',
        },
        resolve,
      ),
    ).parse(argv),
  );
