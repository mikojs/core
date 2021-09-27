const normalize = (scripts, prevKeys = []) =>
  Object.keys(scripts).reduce((result, key) => {
    const keys = [...prevKeys, key];
    const script = scripts[key];

    if (typeof script === 'string')
      return [...result, [keys.join('.'), [{ script }]]];

    if (script instanceof Array) return [...result, [keys.join('.'), script]];

    return [...result, ...normalize(script, keys)];
  }, []);

export default normalize;
