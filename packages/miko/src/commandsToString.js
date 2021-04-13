export default commands =>
  commands
    .map(command =>
      command
        .map(key => {
          if (!/ /.test(key) || /^['"]/.test(key)) return key;

          return key.match(/['"]/)?.[0] === '"' ? `'${key}'` : `"${key}"`;
        })
        .join(' '),
    )
    .join(' && ');
