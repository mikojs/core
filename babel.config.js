module.exports = {
  presets: [
    '@mikojs/base',
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
