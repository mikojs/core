# eslint-config-cat [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

## Getting Started
Install packages using [yarn](https://yarnpkg.com/) (we assume you have pre-installed [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/)).

- Install

  ```sh
  yarn add eslint eslint-config-cat @babel/core babel-plugin-module-resolver --dev
  ```
- Example

  ```js
  // .eslintrc.js
  module.exports = { 
    ...
    extends: [
      'cat'
    ],
    ...
  };

  // .babelrc.js
  // You muse have .babelrc.js for eslint-import-resolver-babel-module
  const alias = {};

  module.exports = alias;
  ```

  You can see the example of [.babelrc.js](./.babelrc.js).

## License
MIT © [HsuTing](http://hsuting.com)

[npm-image]: https://badge.fury.io/js/eslint-config-cat.svg
[npm-url]: https://npmjs.org/package/eslint-config-cat
[travis-image]: https://travis-ci.org/HsuTing/eslint-config-cat.svg?branch=master
[travis-url]: https://travis-ci.org/HsuTing/eslint-config-cat
