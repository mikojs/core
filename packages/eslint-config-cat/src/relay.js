// @flow

import defaultConfig from './index';

export default {
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    jsdoc: {
      ...defaultConfig.settings?.jsdoc,
      additionalTagNames: {
        ...defaultConfig.settings?.jsdoc?.additionalTagNames,
        customTags: [
          ...(defaultConfig.settings?.jsdoc?.additionalTagNames.customTags ||
            []),
          'relayHash',
        ],
      },
    },
  },
};
