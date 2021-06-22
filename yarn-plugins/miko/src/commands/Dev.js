import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration } from '@yarnpkg/core';

export default class Dev extends Command {
  @Command.Path('dev')
  async execute() {
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);

    await configuration.triggerHook(({ dev }) => dev);
  }
}
