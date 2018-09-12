/**
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import configs from 'utils/configs';
import worker from 'utils/worker';

export default (cliName: string, filename: string): {} => {
  worker.usingFile(filename);
  return null |> configs.store[cliName].config || configs.store[cliName];
};
