#!/usr/bin/env node

const webpack = require('webpack');
const { getProDisplayExternals } = require('../tools/proDisplayWebpackAliases');

process.env.RUN_ENV = 'PRODUCTION';
if (!process.env.NODE_OPTIONS) {
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}

const getWebpackConfig = require('../tools/getWebpackConfig');

const configs = getWebpackConfig(false)
  .map(config => {
    const entry = {};
    Object.keys(config.entry || {}).forEach(key => {
      if (key.includes('pro-display')) {
        entry[key] = config.entry[key];
      }
    });
    if (!Object.keys(entry).length) {
      return null;
    }
    return {
      ...config,
      entry,
      externals: getProDisplayExternals(),
    };
  })
  .filter(Boolean);

if (!configs.length) {
  console.error('No pro-display webpack entry found. Set RUN_ENV=PRODUCTION.');
  process.exit(1);
}

webpack(configs, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    process.exit(1);
  }
  if (stats.hasErrors()) {
    console.error(stats.toString({ colors: true }));
    process.exit(1);
  }
  console.log(stats.toString({ colors: true, modules: false, children: false }));
  console.log('\nPro Display UMD: dist/choerodon-ui-pro-display.min.js');
  console.log('Pro Display CSS: dist/choerodon-ui-pro-display.min.css');
});
