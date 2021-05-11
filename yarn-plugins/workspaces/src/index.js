import pluginWorkspaceTools from '@yarnpkg/plugin-workspace-tools';

import Exec from './commands/Exec';
import Run from './commands/Run';

const { commands } = pluginWorkspaceTools;

export default {
  commands: [
    ...commands,
    Exec,
    Run,
  ],
};
