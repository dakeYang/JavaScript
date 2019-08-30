const PENDING = "pending"
const FULLFILLED = "fullfilled"
const REJECTED = "rejected"


// promise2 ，promsie2的resolve ，promise2 的reject,promsie2的then的回调的返回值
const resolvePromise = (promise2, resolve, reject, x) => {
    // 当返回值x的类型为函数或者非空对象时，暂时认为其为一个promise
    if ((!x && typeof x == "object") || typeof x == "function") {
        let called //called的作用是为了防止重复调用的，因为promise的状态一经改变就不能再更改
        try {
            let then = x.then;
            if (typeof then == "function") {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, resolve, reject, y);
                }, r => {
                    if (called) return
                    called = true
                    reject(r);
                })
            } else {
                if (called) return
                called = true
                reject(x);
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }

    } else {
        resolve(x)
    }
}


class Promise {
    constructor(excutor) {
        this.status = PENDING;
        this.data = undefined;
        this.reason = undefined;
        this.fullfilledCallbacks = [];
        this.rejectedCallbacks = [];

        let resolve = data => {
            if (data instanceof Promise) {
                // 如果一个promise resolve了一个新的promise 会等到这个内部的promise执行完成
                return data.then(resolve, reject); // 和resolvePromise的功能是一样的
            }
            if (this.status === PENDING) {
                this.data = data;
                this.status = FULLFILLED;
                this.fullfilledCallbacks.forEach(fn => fn())
            }
        };

        let reject = reason => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.rejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            excutor(resolve, reject);
        } catch (e) {
            reject(e)
        }
    }

    then(onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled == "function" ? onFullfilled : val => val
        onRejected = typeof onRejected == "function" ? onRejected : reason => reason
        // 此处的promise是为了实现.then.then的连环调用
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === PENDING) {
                this.fullfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let data1 = onFullfilled(this.data)
                            resolvePromise(promise2, resolve, reject, data1)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
                this.rejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let reason1 = onRejected(this.reason)
                            resolvePromise(promise2, resolve, reject, reason1)
                        } catch (e) {
                            reject(e)
                        }
                    })
                })
            }

            if (this.status === FULLFILLED) {
                setTimeout(() => {
                    try {
                        // 最初始的Promise的值的成功的回调的返回值；
                        let data1 = onFullfilled(this.data);
                        resolvePromise(promise2, resolve, reject, data1)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        // 最原始的promise失败的回调的return值
                        let reason1 = onRejected(this.reason);
                        resolvePromise(promise2, resolve, reject, reason1);
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2;
    }

    static all(promises = []) {
        let result = [];

        return new Promise((resolve, reject) => {
            for (let i = 0, len = promises.length; i < len; i++) {
                let current = promises[i];

                if (current instanceof Promise) {
                    current.then(data => {
                        result[i] = data
                        if (i == promises.length) {
                            resolve(result)
                        }
                    }, reject)
                } else {
                    result[i] = current;
                    if (i == promises.length) {
                        resolve(result)
                    }
                }

            }
        })
    }


    static finally(fn) {
        return this.then(

        )
    }

    static reject(data) {
        return new Promise((resolve, reject) => {
            reject(data)
        })
    }

    static resolve(data) {
        return new Promise(resolve => {
            resolve(data);
        })
    }

    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0, len = promises.length; i < len; i++) {

                let current = promises[i];

                if (current instanceof Promise) {
                    current.then(data => {
                        resolve(data);
                    }, err => {
                        reject(err)
                    })
                } else {
                    resolve(current);
                }
            }
        })


    }
}


Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })

    return dfd;
}

module.exports = Promise;