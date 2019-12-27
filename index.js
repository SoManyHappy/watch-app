#!/usr/bin/env node
'use strict';
const readline = require('readline');
const process = require("process")
const app = require("./src/app");
const tool = require("./src/tool");

const pathRequire = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cList = [
    { cmd: "component create {n}", desc: "删除名为n的组件" },
    { cmd: "component publish {n}", desc: "发布名为n的组件" },
    { cmd: "component install {n}", desc: "下载/更新名为n的组件" },
    { cmd: "clc-deploy", desc: "打包" },
    { cmd: "clc-generate-page {n}", desc: "新建名为n的页面" },
    { cmd: "clc-generate-page {n} --remove", desc: "删除名为n的页面" }
]

function questionUser() {
    let path = ""
    pathRequire.question('请输入要编译的 文件/目录 :\n', (answer) => {
        path = answer;
        app.checkPath(path, (isFile) => {
            if (isFile) {
                if(tool.regTool(path)) {
                    app.compireFile(path, () => pathRequire.close())
                } else {
                    console.log("该文件格式不可编译!!")
                }
            } else { 
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
            }
        })
    });
}

if (process.argv[2] && process.argv[2] == "-l") {
    for (let i = 0; i < cList.length; i++) {
        console.log(`${i}: ${cList[i].cmd} (${cList[i].desc})\n`)
    }
    process.exit(0)
} else if (!process.argv[2])  {
    questionUser();
} else {
    console.log("?_?  未知..")
    process.exit(0)
}