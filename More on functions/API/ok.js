//response.ok is a boolean value that indicates whether the HTTP response was successful (status code in the range 200-299) or not.
try {
    const response = await fetch('https://api.github.com/users/octocat')
    if (!response.ok){
        throw new Error('There was a problem with the API')
    }
    const data = await response.json()
    console.log(data)
} catch(err) {
    console.log(err)
    //update the DOM to warn the user
    //access an alternative API
} finally {
    console.log('The operation completed.')
}