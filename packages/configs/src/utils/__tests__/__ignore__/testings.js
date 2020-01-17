// @flow

export default [
  [
    'lerna:babel',
    {
      lerna: {
        babel: ['cmd'],
      },
    },
  ],
  [
    'lerna:babel:watch',
    {
      lerna: {
        babel: ['not', 'cmd'],
        'babel:watch': ['cmd'],
      },
    },
  ],
  [
    'lerna:babel:watch',
    {
      lerna: {
        'babel:watch': ['cmd'],
      },
    },
  ],
];
