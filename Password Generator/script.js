let character = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P",
    "Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g",
    "h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x",
    "y","z","0","1","2","3","4","5","6","7","8","9","~","!","@","#","$","%",
    "^","&","*","(",")","_","+","-","=","{","}","[","]",",","|",";",":","<",
    ">",".","/"
]


let lengthEl = document.getElementById("length-el")
let password1 = document.getElementById("pass-el1")
let password2 = document.getElementById("pass-el2")


function generateRandomPassword(length){
    let password = ""
    for (let i = 0; i < length ; i++){
        let randomChar = Math.floor(Math.random() * character.length)
        password += character[randomChar]
    }
    return password
}

function passwords(){
    length = parseInt(lengthEl.value)
    pass1 = generateRandomPassword(length)
    pass2 = generateRandomPassword(length)
    password1.textContent = pass1
    password2.textContent = pass2
}
