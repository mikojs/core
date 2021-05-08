const path = require('path');

module.exports = filename => {
  const name = path.relative(__dirname, filename).replace(/\.js/, '');
  const names = {
    miko: `@mikojs/yarn-${name}`,
    yarn: `@yarnpkg/${name}`,
  };

  try {
    const plugin = require(names.miko);

    return {
      name: names.yarn,
      factory: () => plugin,
    };
  } catch (e) {
    const { error } = console;
    const workspacePath = path.resolve(
      __dirname,
      '../../../yarn-plugins',
      name.replace(/plugin-/, ''),
    );

    if (!new RegExp(names.miko).test(e.message)) error(e);

    if (process.env.NODE_ENV === 'test')
      return {
        name: names.yarn,
        factory: () => require(path.resolve(workspacePath, './src')),
      };

    return require(path.resolve(workspacePath, './bundles', names.yarn));
  }
};
