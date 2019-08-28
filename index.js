'use strict';
const readline = require('readline');
const app = require("./app");

const pathRequire = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

pathRequire.question('请输入要编译的目录:', (answer) => {
    if(answer) {
        app.run(answer);
        pathRequire.close();
        // pathRequire.question('请问是否初始化该目录?(y/n, 默认no):', (answer2) => {
        //     if(answer2.indexOf("y") != -1) {
        //         app.init(answer);
        //     } else {
        //         app.run(answer);
        //     }
        //     pathRequire.close();
        // })
    } else {
        console.warn("请输入目录!!");
    }
});
