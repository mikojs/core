import { BaseCommand as Command } from '@yarnpkg/cli';
import { Configuration, Project, miscUtils, structUtils } from '@yarnpkg/core';
import { NodeFS, npath, ppath } from '@yarnpkg/fslib';

export default class Build extends Command {
  configsCache = {};

  loadConfig = cwd => {
    if (!this.configsCache[cwd]) {
      const baseFs = new NodeFS();

      this.configsCache[cwd] = [
        './.mikorc.js',
        './miko.config.js',
        './miko.json',
      ].reduce(
        (result, configName) => {
          const configPath = ppath.resolve(
            cwd,
            npath.toPortablePath(configName),
          );

          return result || !baseFs.existsSync(configPath)
            ? result
            : miscUtils.dynamicRequire(configPath);
        },
        null,
      );
    }

    return this.configsCache[cwd];
  };

  @Command.Path('build')
  execute = async () => {
    const { cwd, plugins } = this.context;
    const configuration = await Configuration.find(cwd, plugins);
    const { projectCwd } = configuration;
    const { project: { workspaces } } = await Project.find(configuration, projectCwd);

    await configuration.triggerHook(
      ({ build }) => build,
      {
        cli: this.cli,
        workspaces,
        loadConfig: cwd => ({
          ...this.loadConfig(projectCwd),
          ...this.loadConfig(cwd),
        }).build,
      },
    );
  };
}
