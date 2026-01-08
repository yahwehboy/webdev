//select one of many code blocks to execute

function selectItem(item){
    let price = 0

    switch(item){
        case 'coffee':
            price = 2
            break
        case 'sandwiches':
            price = 5
            break
        case 'salad':
            price = 7
            break
        case 'cake':
            price = 4
            break
        default:
            return `Sorry, we don't sell ${item}`
    }
    return `You selected ${item}. That will be ${price}`
}

console.log(selectItem("sandwiches"))