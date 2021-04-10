export default command =>
  command
    .map(key => {
      if (!/ /.test(key) || /^['"]/.test(key)) return key;

      return key.match(/['"]/)?.[0] === '"' ? `'${key}'` : `"${key}"`;
    })
    .join(' ');
