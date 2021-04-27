import { BaseCommand as Command } from '@yarnpkg/cli';

// FIXME
// eslint-disable-next-line require-jsdoc
export default class Build extends Command {
  static usage = Command.Usage({
    category: 'Utils-related commands',
    description: 'build yarn plugins without tsconfig.json',
    details: `
      Tsconfig.json is required for @yarnpkg/builder, but it is not needed for plugins which does not use typescript. This command would generate a tsconfig.json before building plugin. Tsconfig.json would be removed after building finished.
    `,
    examples: [['Build yarn plugin', 'yarn yarn-plugin build']],
  });

  @Command.Path('yarn-plugin', 'build')
  execute = async () => {};
}
