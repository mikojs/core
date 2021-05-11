import pluginWorkspaceTools from '@yarnpkg/plugin-workspace-tools';

import Exec from './commands/Exec';

const { commands } = pluginWorkspaceTools;

export default {
  commands: [
    ...commands,
    Exec,
  ],
};
