export default scripts =>
  Object.keys(scripts).reduce(
    (result, key) => [...result, [key, scripts[key]]],
    [],
  );
