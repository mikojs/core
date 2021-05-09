module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [
    [
      '@babel/proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/proposal-class-properties',
    'add-module-exports',
  ],
};
