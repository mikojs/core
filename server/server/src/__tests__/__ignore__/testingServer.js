// @flow

import testingServer, {
  type fetchResultType as resultType,
} from '../../testingServer';
import build from './build';

export type fetchResultType = resultType;

export default testingServer(build);
