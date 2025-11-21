const input = document.getElementById("input-el")
const btn = document.getElementById("input-btn")
const length = document.getElementById("length")
const volume =  document.getElementById("volume")
const mass = document.getElementById("mass")


btn.addEventListener("click", function(){
    inputValue = Number(input.value)
    convert(inputValue)
})

function convert(value){
    let meter = value * 0.3048
    let feet = value * 3.2808
    let liter = value * 3.785
    let gallon = value * 0.2642
    let kilogram = value * 0.453592
    let pound = value * 2.20462
    length.textContent = `${value} Meters = ${feet.toFixed(3)} Feets | ${value} Feets = ${meter.toFixed(3)} Meters`
    volume.textContent = `${value} Liters = ${gallon.toFixed(3)} Gallons | ${value} Gallons = ${liter.toFixed(3)} Liters`
    mass.textContent = `${value} Kilograms = ${pound.toFixed(3)} Pounds | ${value} Pounds = ${kilogram.toFixed(3)} Kilograms`
}

