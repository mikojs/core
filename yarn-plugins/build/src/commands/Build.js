import fs from 'fs';
import path from 'path';

import chalk from 'chalk';
import { BaseCommand as Command } from '@yarnpkg/cli';

export default class Build extends Command {
  static usage = Command.Usage({
    category: 'Plugin-related commands',
    description: chalk`build yarn plugins without {cyan \`tsconfig.json\`}`,
    details: chalk`
      {cyan \`tsconfig.json\`} is required for {cyan \`@yarnpkg/builder\`}, but it is not needed for plugins which do not use {cyan \`typescript\`}. This command would generate a {cyan \`tsconfig.json\`} before building plugin. {cyan \`tsconfig.json\`} would be removed after building finished.
    `,
    examples: [['Build yarn plugin', 'yarn plugin build']],
  });

  @Command.Path('plugin', 'build')
  execute = async () => {
    const { cwd } = this.context;
    const { run } = this.cli;
    const filePath = path.resolve(cwd, './tsconfig.json');

    fs.writeFileSync(
      filePath,
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
    await run(['run', '--top-level', 'builder', 'build', 'plugin']);
    fs.unlinkSync(filePath);
  };
}
