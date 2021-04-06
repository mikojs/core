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
  plugins: ['add-module-exports'],
  ignore:
    process.env.NODE_ENV === 'test'
      ? []
      : ['**/__tests__/**', '**/__mocks__/**'],
};
