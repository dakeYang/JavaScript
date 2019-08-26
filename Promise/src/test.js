const Promise = require("./promise");


let a = new Promise((resolve, reject) => {
    setTimeout(() => {

        resolve(1111)
    }, 1000)
})
let b = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(1223333)
    }, 1000)
})

a.finally(e=>{
    console.log("e",e)
})



// Promise.race([a, b]).then(data => {
//     console.log(data)
// })