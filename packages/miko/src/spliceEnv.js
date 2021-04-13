export default argv => {
  const result = [...argv];

  return [
    result.splice(
      0,
      result.findIndex(key => !/^[^ ]+=/.test(key)),
    ),
    result,
  ];
};
