import { version } from '../package.json';

const transform = ({ action, ...config }, callback) => ({
  ...config,
  allowUnknownOption: true,
  action: (...args) => {
    const program = args.find(
      arg => typeof arg !== 'string' && !(arg instanceof Array),
    );

    callback([
      ...((typeof action === 'string'
        ? action
        : action?.(program.opts())
      )?.split(/[ ]+/g) || []),
      ...program.args,
    ]);
  },
  commands: Object.keys(config.commands || {}).reduce(
    (result, key) => ({
      ...result,
      [key]: transform(config.commands[key], callback),
    }),
    {},
  ),
});

export default (config, callback) =>
  transform(
    {
      ...config,
      name: 'miko',
      version,
      description: 'Use a simple config to manage commands.',
      arguments: '<args...>',
    },
    callback,
  );
