'use strict';
const readline = require('readline');
const app = require("./app");

const pathRequire = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function questionUser() {
    pathRequire.question('请输入要编译的目录:\n', (answer) => {
        app.run(answer);
        pathRequire.close();
    });
}

questionUser();