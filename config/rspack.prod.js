// @ts-check
const path = require('path');

const getConfig = require('./rspack.common');
const {
    AWP_DEPLOY_ENV, // talos部署环境：production, staging, test02 等
} = process.env;
const Config = getConfig('production');

module.exports = Config;
