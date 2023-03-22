export default {
  antd: {},
  dva: {},
  mfsu: {},
  webpack5: {},
  headScripts: [],
  hash: true,
  theme: {
    '@primary-color': '#1890ff', // 蓝色
  },
  metas: [
    {
      'http-equiv': 'Pragma',
      content: 'no-cache',
    },
    {
      'http-equiv': 'Cache-Control',
      content: 'max-age=0, no-cache, no-store, must-revalidate',
    },
    {
      'http-equiv': 'Expires',
      content: '-1',
    },
    {
      'http-equiv': 'Cache',
      content: 'no-cache',
    },
  ],
  chainWebpack(config, { webpack }) {
    config.module.rule('mjs-rule').test(/.m?js/).resolve.set('fullySpecified', false);
  },
};
