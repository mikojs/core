import { miscUtils } from '@yarnpkg/core';
import { NodeFS, npath, ppath } from '@yarnpkg/fslib';

const baseFs = new NodeFS();

const loadConfigs = cwd =>
  cwd === '/'
    ? {}
    : ['./.mikorc.js', './miko.config.js'].reduce((result, configName) => {
        const configPath = ppath.resolve(cwd, npath.toPortablePath(configName));

        return result || !baseFs.existsSync(configPath)
          ? result
          : miscUtils.dynamicRequire(configPath);
      }, null) || loadConfigs(ppath.resolve(cwd, '..'));

export default loadConfigs;
