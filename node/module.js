// const fs = require("fs");
// const vm = require("vm");
// const path = require("path");

// // node中每个js文件都是一个


// function Module(id) {
//     this.id = id;
//     this.exports = {};
// }

// Module.cache = {};



// Module.extensions = {
//     ".js"(module) {
//         let warpper = [
//             "(function(module,exports,require,__dirname,__filename){\r\n",
//             "\r\n})"
//         ]
//         let data = fs.readFileSync(module.id, 'utf-8');

//         let fnStr = warpper[0] + data + warpper[1];

//         let fn = vm.runInThisContext(fnStr); //只在当前上下文执行，确保不会受其他上下文的变量污染
//         fn.call(module.exports, module, module.exports, req, module.id, path.dirname(module.id));
//     },

//     ".json"(module) {
//         let jsonData = fs.readFileSync(module.id, 'utf-8');
//         module.exports = JSON.parse(jsonData);
//     }
// }


// Module.prototype.load = function () {
//     let extName = path.extname(this.id);

//     Module.extensions[extName](this);
// }

// Module.getFilePath = function (fileName) {
//     let absPath = path.resolve(__dirname, fileName);

//     let extensions = Object.keys(Module.extensions);

//     let current = absPath;

//     if (fs.existsSync(current)) return current;

//     for (let i = 0; i < extensions.length; i++) {
//         if (fs.existsSync(absPath + extensions[i])) {
//             current = absPath + extensions[i];
//             break;
//         } else {
//             current = null;
//         }
//     }


//     if (!current) {
//         throw new Error("file is not exist");
//     }

//     return current;

// }


// function req(fileName) {
//     let id = Module.getFilePath(fileName)

//     if (Module.cache[id]) {
//         return Module.cache[id].exports;
//     }
//     let module = new Module(id);

//     module.load();

//     Module.cache[id] = module;
//     return module.exports;
// }

// let data = req("./a.js")
// req("./a.js")
// console.log(data)


const fs = require("fs");
const path = require("path");
const vm = require("vm");

class Module {
    constructor(id) {
        this.id = id;
        this.exports = {};
    }

    static resolvePath(fileName) {
        // 获取绝对路径
        let absPath = path.resolve(__dirname, fileName);
        // 判断当前路径是否能读取到文件
        let flag = fs.existsSync(absPath);
        let exts = Object.keys(Module.extensions);
        let data = absPath;
        // 不能读取到就给路径添加上后缀名；
        if (!flag) {
            for (let i = 0, len = exts.length; i < len; i++) {
                let flagInner = fs.existsSync(absPath + exts[i]);
                if (flagInner) {
                    data = absPath + exts[i];
                    break;
                } else {
                    data = null;
                }
            }
        }

        // 读取不到文件就报错
        if (!data) {
            throw new Error("file is not existed")
        }

        return data;
    }

    load() {
        // 获取文件后缀名
        let extName = path.extname(this.id);
        Module.extensions[extName](this);
    }

}

Module.extensions = {
    ".js"(module) {
        let wrapper = [
            "(function(module,exports,require,__filename,__dirname){\r\n",
            "\r\n})"
        ]
        let file = fs.readFileSync(module.id, "utf-8");
        let fn = vm.runInThisContext(wrapper[0] + file + wrapper[1]);
        fn.call(module.exports, module, module.exports, req, path.dirname(module.id), module.id);
    },

    ".json"(module) {
        let file = fs.readFileSync("module.id", 'utf-8');
        module.exports = file;
    }
}

Module.cache = {};

function req(fileName) {
    let id = Module.resolvePath(fileName);
    if (Module.cache[id]) {
        return Module.cache[id].exports;
    }
    let module = new Module(id);
    Module.cache[id] = module;
    module.load();
    return module.exports;
}

let data = req('./a.js')
req('./a.js')
console.log(data);