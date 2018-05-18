// @flow

const ENV = process.env.NODE_ENV;
const alias = {};
const ignore = [];

if (ENV !== 'test') {
  ignore.push(
    '**/__tests__/**',
    '**/__testsFiles__/**',
  );
}

module.exports = alias;
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-flow',
  ],
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      cwd: __dirname,
      alias,
    }],
    ['transform-imports', {
      fbjs: {
        transform: 'fbjs/lib/${member}',
      },
    }],
    '@babel/plugin-proposal-optional-chaining',
    'add-module-exports',
  ],
  ignore,
};
