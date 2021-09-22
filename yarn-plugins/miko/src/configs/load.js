import { miscUtils } from '@yarnpkg/core';
import { NodeFS, npath, ppath } from '@yarnpkg/fslib';

const baseFs = new NodeFS();

const load = cwd =>
  cwd === '/'
    ? {}
    : ['./.mikorc.js', './miko.config.js'].reduce(
        (result, name) => {
          const filePath = ppath.resolve(
            cwd,
            npath.toPortablePath(name),
          );

          return result || !baseFs.existsSync(filePath)
            ? result
            : miscUtils.dynamicRequire(filePath);
        },
        null,
      ) || load(ppath.resolve(cwd, '..'));

export default load;
