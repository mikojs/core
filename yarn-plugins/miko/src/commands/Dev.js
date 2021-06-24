import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project, execUtils, structUtils } from '@yarnpkg/core';

export default class Dev extends Command {
  @Command.Path('dev')
  execute = async () => {
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces } } = await Project.find(configuration, projectCwd);
    const { stdout } = await execUtils.execvp(
      'git',
      ['diff', '--name-only'],
      {
        cwd: projectCwd,
        strict: true,
      },
    );
    const changedFiles = stdout.split(/\r?\n/).filter(Boolean);

    await configuration.triggerHook(
      ({ dev }) => dev,
      {
        cwd: projectCwd,
        changedFiles,
        changedWorkspaces: workspaces.filter(
          ({ relativeCwd }) => changedFiles.some(changedFile => changedFile.startsWith(relativeCwd)),
        ),
      },
    );
  }
}
