import { Command } from 'clipanion';

export default paths =>
  Command.Usage({
    category: 'Miko-related commands',
    description: 'run script for development life cycle',
    details: `
      Those commands are based on \`@mikojs/yarn-plugin-miko\`. You could find all commands in \`Examples\`.
    `,
    examples: paths.map(path => [
      `Run \`${path.join(' ')}\` stage in development life cycle`,
      `$0 ${path.join(' ')}`,
    ]),
  });
