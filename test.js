const replace=require('./index');
const path = require('path')

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