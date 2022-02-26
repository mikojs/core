import { addStages } from '@yarnpkg/plugin-miko';

import build from './hooks/build';

export default addStages('builder', { build });
