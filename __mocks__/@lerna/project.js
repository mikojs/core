export const getPackagesSync = jest.fn().mockReturnValue([
  {
    name: '@mikojs/package-a',
    rootPath: '/',
    location: '/package-a',
    bin: {
      'package-a': './lib/bin/index.js',
    },
    dependencies: {
      lerna: '^1.0.0',
      '@mikojs/package-b': '^1.0.0',
    },
  },
  {
    name: '@mikojs/package-b',
    rootPath: '/',
    location: '/package-b',
  },
]);
