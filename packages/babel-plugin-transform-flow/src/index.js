// @flow

import path from 'path';

import { declare } from '@babel/helper-plugin-utils';
import findup from 'findup';

import writeFile from './writeFile';

const pluginOptions = {
  dir: './lib',
  relativeRoot: './src',
  source: 'definitions',
  target: 'flow-tyed',
  extension: /\.js\.flow$/,
};

const flowFiles = [];

export default declare((api, options) => {
  api.assertVersion(7);

  Object.keys(options).forEach(key => {
    pluginOptions[key] = options[key];
  });

  return {
    visitor: {
      ImportDeclaration: (
        {
          node: {
            source: { value },
          },
        },
        { cwd, filename },
      ) => {
        if (!pluginOptions.extension.test(value)) return;

        const sourcePath = path.resolve(filename, '..', value);

        if (
          flowFiles.some(
            ({ sourcePath: flowFilesSource }) => flowFilesSource === sourcePath,
          )
        )
          return;

        // path setting
        const relativePath = sourcePath.replace(
          path.resolve(cwd, pluginOptions.relativeRoot, pluginOptions.source),
          '.',
        );
        const targetPath = path.resolve(
          cwd,
          pluginOptions.dir,
          pluginOptions.target,
          relativePath,
        );

        // module name
        const { name: pkgName } = require(path.resolve(
          findup.sync(sourcePath, 'package.json'),
          './package.json',
        ));
        const modulePath = relativePath
          .replace(pluginOptions.extension, '')
          .replace(/\/index/, '')
          .replace(/^\./, '');
        const moduleName = `${pkgName}${
          modulePath === '' ? '' : pluginOptions.dir.replace(/\./, '')
        }${modulePath}`;

        flowFiles.push({ sourcePath, targetPath, moduleName });
      },
    },
    post: () => {
      flowFiles.forEach(writeFile);
    },
  };
});
