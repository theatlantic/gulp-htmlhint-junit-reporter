module.exports = {
  "extends": "eslint:recommended",
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": 2017
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "eqeqeq": "error"
  },
  "globals": {

  }
};
