import { BaseCommand as Command } from '@yarnpkg/cli';

export default class Dev extends Command {
  @Command.Path('dev')
  async execute() {
  }
}
