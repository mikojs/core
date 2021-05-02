const path = require('path');

const { error } = console;

module.exports = filePath => {
  const filename = path.relative(__dirname, filePath).replace(/\.js/, '');
  const names = {
    miko: `@mikojs/yarn-${filename}`,
    yarn: `@yarnpkg/${filename}`,
  };

  try {
    const plugin = require(names.miko);

    return {
      name: names.yarn,
      factory: () => plugin,
    };
  } catch (e) {
    if (!new RegExp(names.miko).test(e.message)) error(e);

    const workspacePath = path.resolve(
      __dirname,
      '../../..',
      './yarn-plugins',
      filename.replace(/plugin-/, ''),
    );

    if (process.env.NODE_ENV === 'test')
      return {
        name: names.yarn,
        factory: () => require(path.resolve(workspacePath, './src')),
      };

    return require(path.resolve(workspacePath, './bundles', names.yarn));
  }
};
