const normalize = (script, alias) =>
  (script instanceof Array ? script : [script]).map(
    scriptStrOrObj => alias[scriptStrOrObj] || scriptStrOrObj,
  );

export default ({ alias = {}, scripts = {} }) =>
  Object.keys(scripts).reduce(
    (result, key) => [...result, [key, normalize(scripts[key], alias)]],
    [],
  );
