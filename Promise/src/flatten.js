Array.prototype.reduce = function (cb, inititalVal) {

    if (!this.length) throw Error("Void array is not allowed!")
    let sumary = undefined;
    let index;
    if (inititalVal === undefined) {
        sumary = this[0];
        index = 0;
    } else {
        sumary = inititalVal;
    }

    for (let i = ++index || 0, len = this.length; i < len; i++) {

        sumary = cb(sumary, this[i], i, this)
    }

    return sumary;
}

// Array.prototype.reduce = function (cb, inititalVal) {
//     let res = undefined;
//     let startIndex = undefined;

//     if (inititalVal === undefined) {
//         for (let i = 0, len = this.length; i < len; i++) {
//             if (!this.hasOwnProperty(i)) continue;

//             startIndex = i;

//             res = this[i];

//             break;
//         }
//     } else {
//         res = inititalVal;
//     }


//     for (let i = ++startIndex || 0; i < this.length; i++) {

//         if (!this.hasOwnProperty(i)) continue;


//         res = cb(res, this[i], i, this)
//     }

//     return res;
// }

let a = [1];


Array.prototype.flatten = function (deepth = 1) {
    if (deepth === 0) {
        return this;
    }
    deepth--;
    return this.reduce((pre, current) => {
        if (Array.isArray(current)) {
            return [...pre, ...current.flatten(deepth)]
        } else {
            pre.push(current);
            return pre;
        }
    }, [])
}


let b = ["ab", [4, [5, 6, [7, 8]]]];
console.log(b.flatten(1))