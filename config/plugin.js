const dayjs = require('dayjs');
// get & upload emitted SourceMap files
class SourcemapUploadPlugin {
    constructor(options = {}) {}
    apply(compiler) {
        let afterEmit = (compilation, callback) => {
            console.log('\nraptor afterEmit--', dayjs().format('HH:mm:ss'));
            let promiseList = [];
            if (compilation && compilation.chunks) {
                console.log('\n touch sccuess:', '------', dayjs().format('HH:mm:ss'));
                const outputPath = compilation.getPath(compiler.outputPath);
                console.log('\noutputPath:', outputPath, '------', dayjs().format('HH:mm:ss'));
                compilation.chunks.forEach((chunk) => {
                    const { files = [], auxiliaryFiles = [] } = chunk;
                    const allFiles = [...files, ...auxiliaryFiles];
                    allFiles.forEach((filename) => {
                        console.log(
                            `upload ${filename} success!`,
                            '------',
                            dayjs().format('HH:mm:ss'),
                        );
                    });
                });
            }
            callback()
        };
        try {
            if (compiler.hooks && compiler.hooks.afterEmit) {
                compiler.hooks.afterEmit.tapAsync('SourcemapUploadPlugin', afterEmit);
                console.log('raptor register success--', dayjs().format('HH:mm:ss'));
               
            } else {
                console.log('SourcemapUploadPlugin: 未能触发 afterEmit 钩子!');
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = SourcemapUploadPlugin;
