// @flow

import getConfig from 'utils/getConfig';

export default (
  newConfigs: {},
  defaultConfigs?: {} = require('utils/defaultConfigs'),
): {} =>
  getConfig(
    (Object.keys({
      ...defaultConfigs,
      ...newConfigs,
    }): $ReadOnlyArray<string>).reduce((result: {}, key: string): {} => {
      if (
        Object.keys(defaultConfigs[key] || {}).length !== 0 &&
        Object.keys(newConfigs[key] || {}).length !== 0
      )
        return {
          ...result,
          [key]: {
            ...defaultConfigs[key],
            ...newConfigs[key],
          },
        };

      return {
        ...result,
        [key]: newConfigs[key] || defaultConfigs[key],
      };
    }, {}),
  );
