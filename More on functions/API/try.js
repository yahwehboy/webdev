try{
    const response = await fetch('https://bored-api.appbrewery.com/random');
    const data = await response.json();
    console.log(data);
}
catch(error){
    console.error('Error fetching bored activity:', error);
}

finally{
    console.log('Bored activity fetch attempt finished.');
}