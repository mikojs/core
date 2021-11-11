import { declare } from '@babel/helper-plugin-utils';

export default declare(({ assertVersion }) => {
  assertVersion(7);

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
    ],
  };
});
