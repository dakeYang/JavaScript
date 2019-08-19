// 作用：将核心逻辑抽离出来，让使用者可以在核心逻辑之前进行自己的操作

Function.prototype.before = function (fn) {
    return (...args) => {
        fn();
        this(...args);
    }
}

let say = (words) => {
    console.log(words)
}

say("hello");

let sayWithName = say.before(() => {
    console.log("dk");
})

sayWithName("hello");