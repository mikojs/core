// @flow

export default {
  extends: [
    'fbjs/strict',
    'google',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],

    'default-case': 'error',

    indent: ['error', 2, {
      SwitchCase: 1,
    }],

    'no-confusing-arrow': 'error',
    'no-extra-parens': ['error', 'functions'],
    'no-shadow': 'error',
    'no-warning-comments': ['warn', {
      terms: ['todo'],
      location: 'anywhere',
    }],

    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true,
        minProperties: 4,
        consistent: true,
      },
      ObjectPattern: {
        multiline: true,
        minProperties: 4,
        consistent: true,
      },
      ImportDeclaration: {
        multiline: true,
        minProperties: 4,
        consistent: true,
      },
      ExportDeclaration: {
        multiline: true,
        minProperties: 4,
        consistent: true,
      },
    }],

    'quote-props': ['error', 'as-needed'],

    'require-jsdoc': ['error', {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true,
      },
    }],

    strict: ['error', 'never'],
  },
};
