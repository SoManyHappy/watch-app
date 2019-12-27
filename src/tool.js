'use strict';
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
                return "hjson -js " + name;
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
    }
}