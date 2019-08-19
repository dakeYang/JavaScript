class Publisher {
    constructor() {
        this.handlers = []
    }

    // 订阅
    on(eventName, fn) {
        if (!(eventName in this.handlers)) {
            this.handlers[eventName] = [];
        }
        this.handlers[eventName].push(fn);
    }

    // 发布
    emit(eventName, ...args) {
        let event = this.handlers[eventName] || [];
        for (let i = 0, len = event.length; i < len; i++) {
            event[i](...args);
        }
    }

    // 解除订阅
    off(eventName, fn) {
        let event = this.handlers[eventName] || [];
        for (let i = 0, len = event.length; i < len; i++) {
            if (fn == event[i]) {
                event.splice(i, 1);
                break;
            }
        }
    }
}


let publisher = new Publisher();

let console1 = (data) => {
    console.log(data)
}

publisher.on("console", console1)

publisher.on("console", (data) => {
    console.log(data + "2")
})

publisher.emit("console", "hello world")



publisher.off("console", console1)
//hello world
//hello world2


publisher.emit("console", "hello world")
//hello world2