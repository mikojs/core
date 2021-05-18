import chalk from 'chalk';

export default {
  clean: {
    description: chalk`clean the all files which are ignored by {cyan \`git\`}`,
    command: 'git clean -dxf',
  },
};
