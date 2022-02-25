import { Command } from 'clipanion';

export default paths =>
  Command.Usage({
    category: 'Miko-related commands',
    description: 'some custom scripts for development life cycle',
    details: `
      This commands are from \`@mikojs/yarn-plugin-miko\`.
    `,
    examples: paths.map(path => [
      `Run \`${path.join(':')}\` stage in development life cycle`,
      `$0 ${path.join(' ')}`,
    ]),
  });
