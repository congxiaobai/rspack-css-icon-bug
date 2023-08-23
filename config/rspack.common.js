/** @type {import('@rspack/cli').Configuration} */
const path = require('path');
const getConfig = (mode = 'development', devServer) => {
    const srcPath = path.resolve(__dirname, '../src');
    const nodeModulesPath = path.resolve(__dirname, '../node_modules');
    const antv = path.resolve(__dirname, '../node_modules');
    const pnmpModulesPath = path.resolve(__dirname, '../../../node_modules');
    console.log(path.resolve(__dirname, '../deploy'));
    const {
        PUBLIC_URL,
        SOURCEMAP_PUBLIC_URL,
        PROXY,
        AWP_DEPLOY_ENV, // talos部署环境：production, staging, test02 等
    } = process.env;
    return {
        entry: {
            main: path.join(srcPath, 'index.tsx'),
        },
        devtool: 'source-map', // 报错的时候在控制台输出哪一行报错
        output: {
            path: path.resolve(__dirname, '../build/erp'), // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
            publicPath: PUBLIC_URL || '/', // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
        },
  
        mode: mode,
        target: ['web', 'es5'],
        module: {
            rules: [
                {
                    test: /\.tsx?$/i,
                    include: [srcPath, path.resolve(__dirname, '../../foundation')],
                    exclude: [
                        nodeModulesPath,
                        pnmpModulesPath,
                    ],
                },
                {
                    test: /\.jsx?$/i,
                    include: [srcPath, path.resolve(__dirname, '../../foundation')],
                    exclude: [
                        nodeModulesPath,
                        pnmpModulesPath,
                    ],
                },
                {
                    test: /\.js?$/i,
                    include: [srcPath, path.resolve(__dirname, '../../foundation')],
                    exclude: [
                        nodeModulesPath,
                        pnmpModulesPath,
                        path.resolve(__dirname, '../deploy'),
                    ],
                    type: 'javascript/auto',
                },
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        {
                          loader: 'sass-loader',
                          options: {
                            implementation: require('sass'),
                            sassOptions: {
                            outputStyle: 'expanded',
                            },
                          },
                        },
                      ],
                    type: 'css',
                },
                {
                    test: /\.less$/,
                    use: ['less-loader'],
                    type: 'css',
                },
   
                {
                    test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|woff2)(\?|$)/i,
                    type: 'asset',
                },
                {
                    test: /\.svg$/,
                    type: 'asset/resource',
                    exclude: [path.join(srcPath, '/assets/svg')],
                },
                {
                    test: /\.svg$/i,
                    issuer: /\.[t]sx?$/,
                    use: [
                        {
                            loader: '@svgr/webpack',
                            options: { typescript: true, icon: true },
                        },
                    ],
                    exclude: [path.join(srcPath, '/yyfe/Table/src')],
                },
            ],
        },
        optimization:{
            removeAvailableModules:false,
            sideEffects:false,
        },
        builtins: {
            progress: true,
            react: {
                runtime: 'classic',
            },
            
            define: {
                'process.env': 'dev',
                'process.env.DEPLOY_TYPE': JSON.stringify(process.env.DEPLOY_TYPE),
                'process.env.ARENDER_NAME': JSON.stringify('wolf/arender-main'),
                'process.env.ARENDER_VERSION': JSON.stringify('0.9.0'),
                'process.env.AWP_DEPLOY_ENV': JSON.stringify(process.env.AWP_DEPLOY_ENV),
                'process.env.PROXY': JSON.stringify(PROXY),
            },
            minifyOptions: {
                dropConsole: mode !== 'development',
            },

            decorator: { legacy: true },
            html: [
                {
                    template: path.join(srcPath, '/tpl/index.ejs'), //html模板路径
                    templateParameters: {
                        AWP_DEPLOY_ENV: process.env.AWP_DEPLOY_ENV
                            ? JSON.stringify(process.env.AWP_DEPLOY_ENV)
                            : 'dev',
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.less', '.css'], //后缀名自动补全
            alias: {
                '@assets': path.join(srcPath, '/assets'),
                '@components': path.join(srcPath, '/components'),
                '@yyfe/Table': path.join(srcPath, '/yyfe/Table/src'),
                '@yyfe/ProTable': path.join(srcPath, '/yyfe/ProTable/src'),
                '@yyfe/SearchFormForCrud': path.join(srcPath, '/yyfe/SearchFormForCrud/src'),
                '@utils': path.join(srcPath, '/utils'),
                '@': srcPath,
            },
            fallback: {
                'react/jsx-runtime': 'react/jsx-runtime.js',
                'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
            },
            modules: [nodeModulesPath, 'node_modules'],
        },
        // plugins: [
        //     new SourcemapUploadPlugin({
        //         project: 'com.sankuai.medicine.flagship.erp',
        //         env: AWP_DEPLOY_ENV ? AWP_DEPLOY_ENV : 'dev',
        //         delMapFile: true,
        //     }),
        // ],
        devServer: devServer,
    };
};
module.exports = getConfig;
