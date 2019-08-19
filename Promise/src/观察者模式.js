class Subject {
    constructor() {
        this.observers = [];
        this.state = '';
    }

    // 添加观察者
    attach(o) {
        this.observers.push(o);
    }

    setState(state) {
        this.state = state
        this.observers.forEach(o => {
            o.update(this.state);
        })
    }
}


class Observer {
    constructor(name) {
        this.name = name;
    }

    update(...args) {

        console.log("-----------------------------------------", this.name)
        console.log("state:", ...args)
    }
}

let baby = new Subject();
let o1 = new Observer("zhangsan");
let o2 = new Observer("lisi");
baby.attach(o1)
baby.attach(o2)
baby.setState("I'm not happy")