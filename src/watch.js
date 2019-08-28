'use strict';
const fs = require("fs");
const childProcess = require('child_process');
const tool = require("./tool");//{ formatCmd, regTool, compileFile }

const operations = ["change", "rename"];

let initList = []

class Watch {
    constructor(path) {
        this.path = path.split("\\").join("/"); 
        this.task = {};
    };
    // 编译
    compire(name, type) {
        childProcess.exec(tool.formatCmd(name, type), { cwd: this.path }, (err, stdout, stderr) => {
            this.task[name] = "end";
            if (err) {
                console.error("\n文件： " + name + "编译出错！！！");
                // console.error(err.toString() + "\n");
            } else {
                console.log("\n编译文件：" + this.path + "/" + name + "\n");
            }
        })
    };
    // 执行进程
    run() {
        fs.watch(this.path, {
            persistent: true, // persistent 文件被监听时进程是否继续，默认true
            interval: 5000 // interval 多长时间轮训一次目标文件，默认5007毫秒
        }, (e, name) => {
            let type = tool.regTool(name);
            if (operations.indexOf(e) != -1 && type && (!this.task[name] || this.task[name] == "end")) {
                this.task[name] = "start";
                this.compire(name, type);
                // tool.compileFile(this.path + "/" + name, type);
            }
        });
    };
    // 初始化
    init() {
        fs.readdir(this.path, { withFileTypes: true }, (err, files) => {
            if(err) {
                console.err("获取文件目录失败！！")
                return;
            }
            for(let i = 0; i < files.length; i++) {
                let type = tool.regTool(files[i].name)
                if(type && !files[i].isDirectory() && initList.indexOf(files[i].name) == -1) {
                    // let resp = compileFile(this.path + "/" + files[i].name, type);
                    // console.log(resp)
                    console.log(files[i].name)
                    initList.push(files[i].name);
                }
            }
        });
    };
}

module.exports = Watch;