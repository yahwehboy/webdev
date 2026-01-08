import { getStockData } from "./index.js"

setInterval(function() {
    const stockData = getStockData()
    renderStockTicker(stockData)
}, 1500)

let prevPrice = 2.56

function renderStockTicker(stockData){
    const stockName = document.getElementById("name")
    const stockSymbol = document.getElementById("symbol")
    const stockPrice = document.getElementById("price")
    const stockTime = document.getElementById("time")
    const stockIcon = document.getElementById("icon")

    const {name, sym, price, time } = stockData

    const priceDirectionicon = price > prevPrice ? '⬆' : price < prevPrice ? '⬇' : '↪ '

    stockName.innerText = `Name: ${name}`
    stockSymbol.innerText = `Symbol: ${sym}`
    stockPrice.innerText = `Price: ${price}`
    stockTime.innerText = `Time: ${time}`
    stockIcon.innerHTML = priceDirectionicon

    prevPrice = price
}

