module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential", "plugin:prettier/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-empty": 0,
    "no-useless-escape": 0,
    "no-prototype-builtins": 0,
    "vue/multi-word-component-names": 0,
  },
  globals: {
    __dirname: "readonly",
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
    defineModel: "readonly",
  },
};
