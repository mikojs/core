import run from './run';

const transform = ({ action, ...config }) => ({
  ...config,
  allowUnknownOption: true,
  action: (...args) => {
    const program = args.find(
      arg => typeof arg !== 'string' && !(arg instanceof Array),
    );

    run([
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
      [key]: transform(config.commands[key]),
    }),
    {},
  ),
});

export default transform;
