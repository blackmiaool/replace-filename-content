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

    finder.on('directory', function (dir, stat, stop) {
    });

    finder.on('file', async function (file, stat) {
        const content = await fs.readFile(file);
        const result = options.handler({ file, content: content.toString() });
        fs.outputFile(path.join(options.outputDir,path.relative(options.inputDir,result.file)),result.content);
    });
}
function handler(input,data){ 
    const keys=Object.keys(data);
    return input.replace(/{{([\s\S]+?)}}/g,(full,content)=>{
        const result=new Function(...keys,'return '+content)(...keys.map((key)=>data[key]));
        
        return result;
    });
}
const data={a:1,b:2,c:3,d:5,e:4}
replace({
    inputDir: path.join(__dirname,"test"),
    outputDir:path.join(__dirname,'dd'),
    handler({ file, content }) {
        file=handler(file,data);
        content=handler(content,data);
        return {file,content};
    }
})

module.exports = replace;