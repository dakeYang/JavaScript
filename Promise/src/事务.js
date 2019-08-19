// 在核心代码执行之前做某些事情，在核心代码之后又执行某些事件

const transcation = function (methods, wrappers = []) {
    let begins = wrappers.map(wrapper => wrapper.begin)
    let ends = wrappers.map(wrapper => wrapper.end)


    return (...args) => {
        begins.forEach(begin => {
            begin();
        })

        methods(...args);

        ends.forEach(end => {
            end();
        })
    }

}



let visit = (name) => {
    console.log(name)
}

const wrappers = [{
        begin() {
            console.log("nihao")
        },
        end() {
            console.log("baibai")
        }
    },
    {
        begin() {
            console.log("hello")
        },
        end() {
            console.log("byebye")
        }
    }
]

let newVisit = transcation(visit, wrappers);

// visit("zhangsan");

newVisit("zhangsan");