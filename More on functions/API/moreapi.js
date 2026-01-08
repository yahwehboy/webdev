//{JSON Placeholder API}
//free fake API for testing and prototyping
//https://jsonplaceholder.typicode.com/
try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    if (!response.ok){
        throw new Error('There was a problem with the API')
    }
    const data =  await response.json()
    console.log(data)
} catch(err) {
    console.log(err)
}


//fetch API
//The fetch() method is used to make network requests
//It returns a Promise that resolves to the Response object representing the response to the request
//You can use the Response object to access the response data, such as headers and body
//Making a request with fetch uses different methods(GET, POST, PUT, DELETE)
//GET is the default method for getting data
//POST is used to create new data
//PUT is used to update existing data
//DELETE is used to delete data
//PATCH is used to update partial data

//Example of a POST request

try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Secrete',
            body: 'Yahwehboy is the GOAT',
            userId: 1
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok){
        throw new Error('There was a problem with the API')
    } 
    const data = await response.json()
    console.log(data)
} catch(err) {
    console.log(err)
}