/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import moment from 'moment';

import configs from 'utils/configs';
import worker from 'utils/worker';

export default (cliName: string, filename: string): {} => {
  worker.writeCache({ filePath: filename, using: moment().format() });
  return {} |> configs.store[cliName].config || configs.store[cliName];
};
