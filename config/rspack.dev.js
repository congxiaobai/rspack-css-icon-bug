// @ts-check
const path = require('path');

const getConfig = require('./rspack.common');


const Config = getConfig('development', {
    static: path.resolve(__dirname, '../dist'),    open: true, // 开启服务器时，自动打开页面
    hot: true, // 开启热更新
    client: {
        overlay: false,
    },

    historyApiFallback: true,
});

module.exports = Config;
