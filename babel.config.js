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
  ignore:
    process.env.NODE_ENV === 'test'
      ? []
      : ['**/testing/**', '**/__tests__/**', '**/__mocks__/**'],
};
