#!/usr/bin/env node

const webpack = require('webpack');
const { getProDisplayExternals } = require('../tools/proDisplayWebpackAliases');
const pkg = require('../package.json');

process.env.RUN_ENV = 'PRODUCTION';
if (!process.env.NODE_OPTIONS) {
  process.env.NODE_OPTIONS = '--openssl-legacy-provider';
}

const getWebpackConfig = require('../tools/getWebpackConfig');

const PRO_DISPLAY_LIBRARY = 'choerodon-ui/pro-display';
const PRO_DISPLAY_ENTRY = `${pkg.name}-pro-display.min`;

function injectLessVariables(config, variables) {
  (Array.isArray(config) ? config : [config]).forEach(conf => {
    conf.module.rules.forEach(rule => {
      if (rule.test instanceof RegExp && rule.test.test('.less')) {
        const lessRule = rule.use[rule.use.length - 1];
        if (lessRule.options.lessOptions) {
          lessRule.options.lessOptions.modifyVars = {
            ...lessRule.options.lessOptions.modifyVars,
            ...variables,
          };
        } else {
          lessRule.options.modifyVars = {
            ...lessRule.options.modifyVars,
            ...variables,
          };
        }
      }
    });
  });
}

const configs = getWebpackConfig(false)
  .filter(config => config.mode === 'production')
  .map(config => {
    if (!config.entry || !config.entry[PRO_DISPLAY_ENTRY]) {
      return null;
    }
    injectLessVariables(config, { 'c7n-root-entry-name': 'defaultVars' });
    return {
      ...config,
      entry: {
        [PRO_DISPLAY_ENTRY]: config.entry[PRO_DISPLAY_ENTRY],
      },
      output: {
        ...config.output,
        library: PRO_DISPLAY_LIBRARY,
        libraryTarget: 'umd',
      },
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
  console.log(`Global: window["${PRO_DISPLAY_LIBRARY}"]`);
  console.log('Pro Display CSS: dist/choerodon-ui-pro-display.min.css');
});
