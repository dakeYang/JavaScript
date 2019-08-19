const Promise = require("./promise");


let a = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            then() {

            }
        })
    }, 1000)
})

a.then(
    data => {
        console.log(data)
        return data;
    },
    err => {
        console.log(err)
        return err

    }).then(data => {
        console.log("data", data)
    }, err => {
        console.log("err", err)
    })