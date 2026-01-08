const promise = new Promise((resolve, reject) => {
    const success = Math.random() > 0.5
    if (success){
        resolve("Operation successfull")
    } else{
        reject("Operation failed")
    }
})

promise.then(response => console.log(response))