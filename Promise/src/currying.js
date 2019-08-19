

let currying = (fn, argArr = []) => {
    let len = fn.length;
    return (...args) => {
        argArr = argArr.concat(args);
        if (argArr.length < len) {
            return currying(fn, argArr);
        }
        return fn(...argArr);
    }
}

let add = (a, b, c) => {
    return a + b + c;
}


let b = currying(add);


let c = b(1)(2)(3);

console.log(c); //6