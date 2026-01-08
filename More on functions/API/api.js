fetch('https://dog.ceo/api/breeds/image/random')
    .then(response => response.json())//parsing the response to JSON
    .then(data => {//accessing the data from the response
        const imgElement = document.getElementById('dogImage');
        imgElement.src = data.message;
    })
    .catch(error => console.error('Error fetching dog image:', error))//catch block to handle any errors
    .finally(() => console.log('Fetch attempt finished.'));//finally block runs regardless of the outcome