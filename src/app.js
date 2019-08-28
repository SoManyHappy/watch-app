'use strict';
const fs = require("fs");
const watch = require("./watch");
const tool = require("./tool");

const ingoreObj = {
    file: [".git", ".idea"],
    dir: ["node_modules", "log", "public", "test", ".vscode"]
};

let wList = [];
let watchObj = {};

//获取文件夹下属所有包含了coffee/hjson/scss/jade的文件夹目录
module.exports = {
    run: function (path) {
        fs.readdir(path, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.err("获取文件目录失败！！");
                return;
            }
            if (ingoreObj.dir.indexOf(path) != -1) {
                return;
            }
            for (let i = 0; i < files.length; i++) {
                let isDir = files[i].isDirectory()
                if (wList.indexOf(path) == -1 && !isDir && tool.regTool(files[i].name)) {
                    watchObj[path.split("/").join(".")] = new watch(path);
                    watchObj[path.split("/").join(".")].run();
                    wList.push(path);
                } else if (wList.indexOf(path + "/" + files[i].name) == -1 && isDir) {
                    this.run(path + "/" + files[i].name);
                }
            }
        });
    }
}