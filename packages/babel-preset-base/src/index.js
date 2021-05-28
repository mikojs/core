import { declare } from '@babel/helper-plugin-utils';

export default declare(
  ({ assertVersion }) => {
    assertVersion(7);

    return {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
          },
        ],
      ],
    };
  },
);
