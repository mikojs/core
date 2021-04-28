import { Configuration, Project } from '@yarnpkg/core';

export default async (cwd, pluginConfiguration) => {
  const configuration = await Configuration.find(cwd, pluginConfiguration);

  return {
    ...(await Project.find(configuration, cwd)),
    configuration,
  };
};
