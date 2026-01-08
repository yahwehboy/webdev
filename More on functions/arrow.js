const getSpendAlret = (amount) => {
    return `Warning! You just spent $${amount}: `
}

console.log(getSpendAlret(900))

const speedWarning = speed => {
    let avgSpeed = 40
    if (speed > avgSpeed){
        return `Hey! You're going too fast at ${speed}mph!!`
    } else{
        return `Your speed is ${speed}mph`
    }
}

console.log(speedWarning(50))