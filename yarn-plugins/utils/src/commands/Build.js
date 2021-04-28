import fs from 'fs';
import path from 'path';

import { BaseCommand as Command } from '@yarnpkg/cli';

import findBuilder from '../utils/findBuilder';

export default class Build extends Command {
  static usage = Command.Usage({
    category: 'Plugin-related commands',
    description: 'build yarn plugins without tsconfig.json',
    details: `
      Tsconfig.json is required for @yarnpkg/builder, but it is not needed for plugins which does not use typescript. This command would generate a tsconfig.json before building plugin. Tsconfig.json would be removed after building finished.
    `,
    examples: [['Build yarn plugin', 'yarn plugin build']],
  });

  @Command.Path('plugin', 'build')
  execute = async () => {
    const { cwd } = this.context;
    const tsconfigFilePath = path.resolve(cwd, './tsconfig.json');

    fs.writeFileSync(
      tsconfigFilePath,
      JSON.stringify(
        {
          compilerOptions: {
            allowJs: true,
          },
          include: ['src/**/*'],
        },
        null,
        2,
      ),
    );
    await this.cli.run(['node', findBuilder(), 'build', 'plugin']);
    fs.unlinkSync(tsconfigFilePath);
  };
}
