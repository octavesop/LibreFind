module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-console': 'warn', // console.log의 사용을 금함
    'no-throw-literal': 'warn', // throw "e" => throw new Error("e")
    'no-underscore-dangle': 'off', // 변수 및 메소드 이름에 언더바 사용을 금함
    '@typescript-eslint/no-var-requires': 'error', // var 사용을 금함
    '@typescript-eslint/no-empty-function': 'warn', // 비어있는 함수를 금함
    '@typescript-eslint/no-unused-vars': 'error', // 선언만 해둔 변수 사용을 금함
    '@typescript-eslint/no-explicit-any': 'warn', // any 사용을 금함
    '@typescript-eslint/naming-convention': [
      // 클래스의 이름은 대문자로 강제함.
      'error',
      {
        selector: 'class',
        format: ['PascalCase'],
        custom: { regex: '^I[A-Z]', match: false },
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: { regex: '^I[A-Z]', match: false },
      },
    ],
  },
};
