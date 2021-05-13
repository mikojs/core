import chalk from 'chalk';

export default (str, examples) => ({
  category: 'Workspace-related commands',
  description: chalk`${str} with {cyan \`@yarnpkg/plugin-workspace-tools\`}`,
  details: chalk`
    Because {cyan \`@yarnpkg/plugin-workspace-tools\`} would ${str} in the all workspaces included the root workspace, the root workspace is not needed for the most case. Using this command to ${str} expect for the root workspace.

    On the other hand, this command also add some helpful options to find the specific workspaces.
  `,
  examples: [['Run script', 'yarn workspaces run build']],
});
