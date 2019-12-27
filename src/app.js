'use strict';
const fs = require("fs");
const childProcess = require('child_process');
const watch = require("./watch");
const init = require("./init");
const tool = require("./tool");

const ingoreObj = {
    file: [".git", ".idea"],
    dir: ["node_modules", "log", "public", "test", ".vscode"]
};

let wList = [];
let watchObj = {};
let initObj = {};

//获取文件夹下属所有包含了coffee/hjson/scss/jade的文件夹目录
module.exports = {
    run: function (path) {
        if(path.indexOf("\\") != -1) {
            path = path.split("\\").join("/");
        }
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
    },
    compire: function(path) {
        if(path.indexOf("\\") != -1) {
            path = path.split("\\").join("/");
        }
        fs.readdir(path, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.err("获取文件目录失败！！");
                return;
            }
            if (ingoreObj.dir.indexOf(path) != -1) {
                return;
            }
            let [arr1, arr2] = [[], []]
            for (let i = 0; i < files.length; i++) {
                let isDir = files[i].isDirectory()
                let _path = path + "/" + files[i].name
                let type = tool.regTool(files[i].name)
                if (!isDir && type) {
                    arr1.push({ name: files[i].name, type, path });
                } else if (isDir) {
                    arr2.push(_path);
                }
            }
            if(arr1.length > 0) {
                let key = arr1[0].path.split("/").join(".");
                initObj[key] = new init(arr1);
                initObj[key].run();
            }
            if(arr2.length > 0) {
                for (let j = 0; j < arr2.length; j++) {
                    this.compire(arr2[j])
                }
            }
        });
    },
    checkPath: function(path, callback) {
        fs.stat(path, function (err, stat){
            if (err || stat.isFile()) {
                callback(true)
            } else {
                callback(false)
            }
        })
    },
    compireFile: function(path, call) {
        if(path.indexOf("\\") != -1) {
            path = path.split("\\").join("/");
        }
        let fileName = path.split("/").reverse()[0]
        let dirName = path.split("/").slice(0,-1).join("/")
        let type = tool.regTool(fileName)
        childProcess.exec(tool.formatCmd(fileName, type), { cwd: dirName }, (err, stdout) => {
			if (err) {
				console.error("\n文件： " + path + "编译出错！！！");
				console.error(err.toString() + "\n");
			} else {
				if(type == "hjson") { 
					let _path = this.path + "/" + fileName.replace(/.hjson/, ".json")
                    fs.writeFile(_path, stdout, (err) => {
                        if (err) {
				            console.error("\n文件： " + path + "编译出错！！！"); 
                            console.error(err.toString() + "\n") 
                        } else {
                            console.log("\n编译文件：" + path);
                        }
                        call()
                    })
				} else {
                    console.log("\n编译文件：" + path);
                    call()
                }
			}
		})
    }
}