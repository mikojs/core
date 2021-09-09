import { SettingsType } from '@yarnpkg/core';

import build, { configuration as buildConfiguration } from './hooks/build';

export default {
  hooks: { build },
  configuration: {
    babel: {
      description: 'Babel commands are used in each development stage',
      type: SettingsType.SHAPE,
      properties: {
        build: buildConfiguration,
      },
    }
  },
};
