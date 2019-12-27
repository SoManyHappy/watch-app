'use strict';
const childProcess = require('child_process');
const tool = require("./tool");

class Init {
    constructor(list) {
        this.initList = list;
    };
    // 编译
    compire(item, call) {
        childProcess.exec(tool.formatCmd(item.name, item.type), { cwd: item.path }, (err) => {
            if (err) {
                console.error("\n文件： " + item.path + "/" + item.name + "编译出错！！！");
            }
            call();
        })
    };
    // 执行进程
    run() {
        let count = 0;
        for(let i = 0; i < this.initList.length; i++) {
            this.compire(this.initList[i], () => {
                count++;
                if(count == this.initList.length) {
                    console.log(`\n${this.initList[0].path}目录下文件编译完成!!\n`);
                }
            })
        }
    };
}

module.exports = Init;