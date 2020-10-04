// @flow

import testingServer, {
  type fetchResultType as resultType,
  type testingServerType,
} from '../../testingServer';
import build from './build';

export type fetchResultType = resultType;

export default (testingServer(build): testingServerType);
