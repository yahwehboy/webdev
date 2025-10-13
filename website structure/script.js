//Variables-They store values
let name = "YahwehBoy"
var age = 27

const PI = 3.14

//Data Types
let my_name = "Olalekan" //strings 'olalekan'
let myNumber = 9 //numbers
let condition = true //boolean- true or false
let vegetables = ["Spinach", "Lettuce", "Gabbage", "Water-leaf"] //arrays
let car = {
    name: "Toyota",
    brand: "Corolla",
    color: "White"
}// objects- contain keys and values

//Operators
let add = 4 + 5
let sub = 5 - 4
let added = age + myNumber
let con = "Olalekan " + "Yahwehboy" //concatenation
let identity = 4 === 3 //comparison false
let negation = 4 !== 3 //true
let notGreater = 3 > 3 //false
let check = !notGreater//true

console.log(name)
console.log(add)
console.log(con)
console.log(identity)
console.log(notGreater)
console.log(check)

//Conditional statement
if ( 6 === 4){
    console.log("Yes")
} else {
    console.log("No")
}


//Functions - are a group of codes that can perform a specific task
function addition(x, y){
    return console.log(x + y)
}

addition(6, 10)
addition(10, 20)

//Events and DOM
function greeting() {
    let name = "YahwehBoy" //local variable
    return document.getElementById("output").innerHTML = "Hello " + name
}

//Get name from input
function hello(myname){
    myname = document.getElementById("name").value
    return document.getElementById("demo").innerHTML = "Hello "+myname
}

function calc(x, y){
    x = parseInt(document.getElementById("x").value)
    y = parseInt(document.getElementById("y").value)
    return document.getElementById("result").innerHTML = x + y
}