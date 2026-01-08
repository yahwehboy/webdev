export function getStockData(){
    return {
        name: 'YahtechAI',
        sym: 'YTA',
        price: (Math.random() * 3).toFixed(2),
        time: new Date().toLocaleTimeString()
    }
}