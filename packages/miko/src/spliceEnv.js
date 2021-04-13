export default argv => {
  const result = [...argv];

  return {
    env: result.splice(
      0,
      result.findIndex(key => !/^[^ ]+=/.test(key)),
    ),
    argv: result,
  };
};
