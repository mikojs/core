import pluginConfiguration from './pluginConfiguration';

import findInfo from '../findInfo';

export default async hook => {
  const { project } = await findInfo(process.cwd(), pluginConfiguration);

  return hook(project);
};
