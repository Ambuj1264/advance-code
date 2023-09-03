module.exports = {
  extends: "../../../.eslintrc.js",
  settings: {
    "import/resolver": {
      typescript: {
        project: __dirname,
      },
    },
  },
  rules: {
    "no-plusplus": [
      "error",
      {
        allowForLoopAfterthoughts: true,
      },
    ],
  },
};
