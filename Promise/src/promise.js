const PENDING = "pending"
const FULLFILLED = "fullfilled"
const REJECTED = 'rejected'


let resolvePromise = (promise2, x, resolve, reject) => {
    // 如果此时相等，抛出类型错误
    if (promise2 === x) {
        reject(new TypeError("<#Promise> wrong!"));
        return;
    }

    // 当此时的x是一个对象或者函数时，x可能是一个Promise
    if ((x !== null && typeof x === "object") || typeof x === "function") {
        let called
        try {
            // 如果x有一个then方法，此时就认为其为一个Promise,
            // 如果不是，就直接将这个值resolve出去
            let then = x.then;
            if (typeof then === "function") {
                // 此时重新调用then方法，获取上一个then方法中回调的返回值，y，r
                then.call(x, y => {
                    if (called) return;
                    called = true
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true
                    reject(r);
                })
            } else {
                if (called) return;
                called = true
                resolve(x)
            }

        } catch (e) {
            if (called) return;
            called = true
            reject(e)
        }
    } else {
        resolve(x);
    }
}


class Promise {
    constructor(excutor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.fullfilledCallbacks = [];
        this.rejectedCallbacks = [];

        let resolve = data => {
            if (data instanceof Promise) {
                // 如果一个promise resolve了一个新的promise 会等到这个内部的promise执行完成
                return value.then(resolve, reject); // 和resolvePromise的功能是一样的
            }
            // 只有pending状态下才可以更改状态，状态更改后不可更改
            if (this.status === PENDING) {
                this.status = FULLFILLED;
                this.value = data;
                // 发布then的成功回调
                this.fullfilledCallbacks.forEach(fn => fn())
            }
        }

        let reject = reason => {
            // 只有pending状态下才可以更改状态，状态更改后不可更改
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                // 发布then的reject回调
                this.rejectedCallbacks.forEach(fn => fn())
            }
        }
        try {

            excutor(resolve, reject);
        } catch (e) {
            reject(e)
        }
    }


    // 当then的回调有返回值时，后面可以链式使用.then方法,
    // 有then方法，说明then的返回值，其实是一个promise
    then(onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled === 'function'?onFullfilled:val=>val;
        onRejected = typeof onRejected === 'function'?onRejected:err=>{throw err};
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULLFILLED) {
                setTimeout(() => {
                    try {

                        let x = onFullfilled(this.value)
                        // x可能也是一个Promise,所以这里单独写一个函数处理x;
                        // 此时直接取promise2可能会报错，所以需要try catch一下
                        resolvePromise(promise2, x, resolve, reject)


                    } catch (e) {
                        // 如果报错直接rejected就行
                        reject(this.reason);
                    }
                })
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {

                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject)


                    } catch (e) {
                        reject(e);
                    }
                })
            }

            if (this.status === PENDING) {
                // 为了解决立即执行函数中可能存在异步代码，
                // 这里使用订阅发布模式将then的回调函数先进行订阅，
                // 等到立即执行函数中的resolve或者reject执行之后发布回调（执行回调）
                this.rejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {

                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);


                        } catch (e) {
                            reject(e);
                        }
                    })
                })

                this.fullfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {

                            let x = onFullfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);


                        } catch (e) {
                            reject(e);
                        }
                    })
                })
            }
        })

        return promise2;
    }

    static resolve(data) {
        return new Promise(resolve => {
            resolve(data);
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        })
    }

    static all(promises = []) {
        let data = [];
        return new Promise((resolve, reject) => {
            let len = promises.length;
            for (let i = 0; i < len; i++) {
                let currentItem = promises[i]
                if (currentItem instanceof Promise) {
                    currentItem.then(result => {
                        data[i] = result;
                        if (i == len - 1) {
                            resolve(data)
                        }
                    }, reject)
                } else {
                    data[i] = currentItem;
                    if (i == len - 1) {
                        resolve(data)
                    }
                }
            }
        })
    }

    finally(cb) {
        return this.then(cb, cb)
    }

    static race(promises = []) {
        return new Promise((resolve, reject) => {
            for (let i = 0, len = promises.length; i < len; i++) {
                let currentItem = promises[i];

                if (currentItem instanceof Promise) {
                    currentItem.then(res => {
                        resolve(res);
                    })
                } else {
                    resolve(currentItem);
                }
            }
        })
    }

    catch (errCallback) {
        return this.then(null, errCallback)
    }

    static try (fn) {
        return new Promise((resolve, reject) => {
            resolve(fn())
        })
    }

}



module.exports = Promise;