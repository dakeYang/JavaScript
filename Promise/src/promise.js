const PENDING = "pending"
const FULLFILLED = "fullfilled"
const REJECTED = "rejected"


class Promsie {
    constructor(excutor) {
        this.status = PENDING;
        this.data = undefined;
        this.reason = undefined;
        this.fullfilledCallbacks = [];
        this.rejectedCallbacks = [];

        let resolve = data => {
            if (this.status === PENDING) {
                this.status = FULLFILLED;
                this.data = data;
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

        excutor(resolve, reject);

    }


    then(onFUllfilled, onRejected) {
        let promise2 = new Promsie((resolve, reject) => {
            if (this.status === PENDING) {
                this.fullfilledCallbacks.push(onFUllfilled)
                this.rejectedCallbacks.push(onRejected)
            }

            if (this.status === FULLFILLED) {
                resolve(this.data)
                onFUllfilled(this.data);
            }

            if (this.status === REJECTED) {
                reject(this.reason)
                onRejected(this.reason);
            }
        })


        return promise2;

    }
}