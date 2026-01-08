const speedWarning = (speed, avgSpeed = 40) => {
    if (speed > avgSpeed ){
        return `Hey! You're going too fast at ${speed}mph!!`
    } else{
        return `Your speed is ${speed}mph`
    }
}

console.log(speedWarning(50))