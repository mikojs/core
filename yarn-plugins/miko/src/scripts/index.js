import load from './load';
import normalize from './normalize';

export default normalize(load(process.cwd()));
