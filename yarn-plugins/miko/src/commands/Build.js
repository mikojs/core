import Command from './Base';

export default class Build extends Command {
  @Command.Path('build')
  execute = this.triggerHook;
}
