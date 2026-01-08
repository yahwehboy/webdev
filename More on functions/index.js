import { propertyForSale } from "./prop.js"

const placeholderProp = {
        propertyLocation: 'Ikoyi, Lagos',
        price: '$250,000',
        comment: 'Beautiful interior and a spacious room',
        size: '6m',
        image: 'images/im4.jpg'
    }


function getProp(propertyArr = [placeholderProp]) {
    return propertyArr.map(property => {
        const {propertyLocation, price, comment, size, image} = property
        return `
        <section class="card">
            <img src="${image}" alt="Ijapo">
            <div class="estate">
                <h2 class="title">${propertyLocation}</h2>
                <p class="price">${price}</p>
                <p class="about">${comment}</p>
                <h5 class="distant">${size}</h5>
            </div>
        </section>`
        }).join(" ")
}


document.getElementById("container").innerHTML = getProp(propertyForSale)

