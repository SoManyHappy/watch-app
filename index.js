#!/usr/bin/env node
'use strict';
const readline = require('readline');
const app = require("./src/app");

const pathRequire = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function questionUser() {
    let path = ""
    pathRequire.question('请输入要编译的目录:\n', (answer) => {
        path = answer;
        pathRequire.question('是否初始化?(y/n):', (answer2) => {
            if(answer2.indexOf("y") != -1) {
                console.log(`开始初始化目录:${path}`);
                app.compire(path);
            } else {
                console.log(`开始监听目录:${path}`);
                app.run(path);
            }
            pathRequire.close();
        });
    });
}

questionUser();