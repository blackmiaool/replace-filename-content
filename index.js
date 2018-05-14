const fs = require('fs-extra');
const path = require('path')

function replace(options) {
    const defaultOptions = {
        handler: ({ file, content }) => ({ file, content }),
        fileContentReplace: (fileContent) => fileContent,
        inputDir: path.join(__dirname, 'replace_input'),
        outputDir: path.join(__dirname, 'replace_output')
    };
    options = Object.assign(defaultOptions, options);
    const finder = require('findit')(options.inputDir);

    finder.on('file', async function (file, stat) {
        const content = await fs.readFile(file);
        const result = options.handler({ file, content: content.toString() });
        fs.outputFile(path.join(options.outputDir,path.relative(options.inputDir,result.file)),result.content);
    });
}

module.exports = replace;