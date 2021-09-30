import createScripts from './createScripts';

const normalize = (scripts, prevKeys = []) =>
  Object.keys(scripts).reduce((result, key) => {
    const keys = [...prevKeys, key];
    const script = scripts[key];

    if (typeof script === 'string')
      return [...result, [keys.join('.'), createScripts([{ script }])]];

    if (script instanceof Array)
      return [...result, [keys.join('.'), createScript(script)]];

    return [...result, ...normalize(script, keys)];
  }, []);

export default normalize;
