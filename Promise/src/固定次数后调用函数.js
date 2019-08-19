// 作用：函数调用固定次数后，才执行核心代码

Function.prototype.afterTimes = function (times = 0) {
    return (...args) => {
        if (--times == 0) {
            this(...args);
        }
    }
}


let hello = () => {
    console.log("hello")
}

hello();

let newHello = hello.afterTimes(2);

newHello();
newHello();