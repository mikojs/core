import Build from './commands/Build';

export default {
  commands: [Build],
  hooks: {
    build: console.log,
  },
};
