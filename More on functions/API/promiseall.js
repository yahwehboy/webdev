function getImagePromise(url){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = new Image()
            img.src =  url
            img.alt =  'sample image'
            img.addEventListener('load', () => resolve(img))
            img.addEventListener('error', () => reject(new Error(`image load error: ${url}`)))
    })
}, 500)
}


const images = [
    'https://unsplash.com/photos/man-in-black-crew-neck-t-shirt-using-black-laptop-computer-b9-odQi5oDo',
    'https://unsplash.com/photos/black-iphone-7-on-white-laptop-computer-KW0rZJojScM',
    'https://unsplash.com/photos/black-iphone-4-with-red-and-white-flag-qXfD_nG4j-U'
]

async function preloadImages(imageUrlisArr){
    const imgContainer = document.getElementById('img-container');
    const uploadContainer = document.getElementById('upload-container');

    const promises =  imageUrlisArr.map((images) => getImagePromise(images))

    try{
        const results =  await Promise.all(promises)
        results.forEach(img => imgContainer.appendChild(img))
    } catch(err){
        const errorMsg = document.createElement('p')
        errorMsg.textContent = `Error loading images: ${err.message}`
        uploadContainer.appendChild(errorMsg)
    }
}