async function bored(){
    const response = await fetch('https://bored-api.appbrewery.com/random')
    const data = await response.json()
    console.log(data)
}

bored()