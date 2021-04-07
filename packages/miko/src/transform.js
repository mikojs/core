import run from './run';

const transform = ({ command, ...config }) => ({
  ...config,
  allowUnknownOption: true,
  action: () => run(command),
  commands: Object.keys(config.commands || {}).reduce(
    (result, key) => ({
      ...result,
      [key]: transform(config.commands[key]),
    }),
    {},
  ),
});

export default transform;
