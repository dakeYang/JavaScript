// const chalk = require("chalk");

// function EventEmitter() {
//     this._events = Object.create(null);
// }

// EventEmitter.prototype.on = function (eventName, callback) {
//     if (!this._events) this._events = Object.create(null);
//     if (eventName != "newListener") {
//         this.emit("newListener", eventName);
//     }
//     (this._events[eventName] || []).push(callback);
// }

// EventEmitter.prototype.emit = function (eventName, ...args) {
//     let events = this._events[eventName];
//     if (!this.events) throw new Error("event not found")

//     events.forEach(fn => {
//         fn(...args)
//     });
// }

// EventEmitter.prototype.once = function (eventName, callback) {
//     let onceCb = () => {
//         callback();
//         this.off(eventName, onceCb);
//     }
//     onceCb.cb = callback;
//     this.on(eventName, onceCb);
// }

// EventEmitter.prototype.off = function (eventName, cb) {
//     let events = this._events[eventName];

//     if (events) {
//         this._events[eventName].filter(fn => fn != cb && fn.cb != cb);
//     }
// }


class EventEmitter {
    _events = Object.create(null)

    on(eventName, cb) {
        if (!this._events) this._events = Object.create(null);

        if (eventName != "newListener") {
            this.emit("newListener", eventName);
        }


        if (this._events[eventName]) {
            this._events[eventName].push(cb)
        } else {
            this._events[eventName] = [cb]
        }
    }

    emit(eventName, ...args) {
        if (this._events[eventName]) {
            this._events[eventName].forEach(fn => fn(...args))
        }
    }

    off(eventName, cb) {
        if (this._events[eventName]) {
            this._events[eventName] = this._events[eventName].filter(fn => fn != cb && fn.cb != cb);
        }
    }

    once(eventName, cb) {
        let onecb = () => {
            cb();
            this.off(eventName, onecb);
        }

        onecb.cb = cb;

        this.on(eventName, onecb);
    }
}