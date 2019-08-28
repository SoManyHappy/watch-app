'use strict';
const fs = require("fs");
const nodeSass = require("node-sass");
const jade = require("jade");
const hjson = require("hjson");
const coffee = require("iced-coffee-script");

let typeList = ['coffee', 'jade', 'hjson', 'sass'];
let regList = [new RegExp("[.](coffee)$"), new RegExp("[.](jade)$"), new RegExp("[.](hjson)$"), new RegExp("[.](sass)$")];

module.exports = {
    // 格式化命令
    formatCmd: function (name, type) {
        switch (type) {
            case 'coffee':
                return "iced --bare --runtime none --compile " + name;
            case 'jade':
                return "jade " + name;
            case 'hjson':
                return "hjson -j " + name + " " + name.replace(/.hjson/, ".json");
            case 'sass':
                return "node-sass " + name + " " + name.replace(/.sass/, ".css");
        }
    },
    // 校验
    regTool: function (str) {
        for (let x = 0; x < regList.length; x++) {
            if (regList[x].test(str)) {
                return typeList[x];
            }
        }
        return false;
    },
    // 编译
    compileFile: function (name, type) {
        console.log("compileFile:", {name, type})
        switch (type) {
            case 'coffee':
                fs.readFile(name, (err, buffer) => {
                    if (err) {
                        console.log(`${name}编译失败!!`)
                    }
                    let result = coffee.compile(buffer.toString());
                    fs.writeFile(name.replace(/.coffee/, ".js"), result, (err2) => {
                        console.log(`编译: ${name}${err2 ? '  --  失败!!' : ''}`)
                    });
                });
            case 'jade':
                let buff = jade.compileFile(name, {})();
                let target = name.replace(/.jade/, ".html")
                fs.writeFile(target, buff, (err2) => {
                    console.log(`编译: ${name}${err2 ? '  --  失败!!' : ''}`)
                });
            case 'hjson':
                fs.readFile(name, (err, buffer) => {
                    console.log("hjson:", err, buffer);
                    if (err) {
                        console.log(err)
                        console.log(`${name}编译失败!!`)
                    }
                    let result = hjson.parse(buffer.toString());
                    fs.writeFile(name.replace(/.hjson/, ".json"), JSON.stringify(result), (err2) => {
                        console.log(err2)
                        console.log(`编译: ${name}${err2 ? '  --  失败!!' : ''}`)
                    });
                });
            case 'sass':
                nodeSass.render({ file: name }, (err, resp) => {
                    if (err) {
                        console.log(`${name}编译失败!!`)
                    }
                    if(resp) {
                        fs.writeFile(name.replace(/.sass/, ".css"), resp.css, (err2) => {
                            console.log(`编译: ${name}${err2 ? '  --  失败!!' : ''}`)
                        });
                    } else {
                        console.log(`编译: ${name}  --  失败!!}`)
                    }
                });
        }
    }
}