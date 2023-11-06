module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb/rules/react', 'plugin:jest/recommended', 'prettier'],
  plugins: ['babel', 'import', 'react', 'prettier'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'prettier/prettier/arrowParens': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    'import/prefer-default-export': 'off',
    'react/no-children-prop': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['uikit', './src/submodules/uikit'],
          ['utils', './src/submodules/utils'],
          ['redux-store', './src/submodules/redux-store'],
        ],
      },
    },
  },
};
