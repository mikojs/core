import { version } from '../package.json';

import runCommands from './runCommands';

const transform = ({ command, ...config }) => ({
  ...config,
  allowUnknownOption: true,
  action: () => runCommands(command),
  commands: Object.keys(config.commands || {}).reduce(
    (result, key) => ({
      ...result,
      [key]: transform(config.commands[key]),
    }),
    {},
  ),
});

export default commands =>
  transform({
    name: 'miko',
    version,
    description: 'Use a simple config to manage commands.',
    arguments: '<commands...>',
    commands,
  });
