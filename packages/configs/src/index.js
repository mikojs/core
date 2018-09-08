// @flow

import configs from 'utils/configs';

export default (cliName: string) =>
  null |> configs.store[cliName].config || configs.store[cliName];
