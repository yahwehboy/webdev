let homeScore = document.getElementById("home-score")
let guestScore = document.getElementById("guest-score")
let hscore = 0
let gscore = 0

function homePlus0neBtn(){
    hscore += 1
    homeScore.innerText = hscore
}

function guestPlus0neBtn(){
    gscore += 1
    guestScore.innerText = gscore
}

function homePlusTwoBtn(){
    hscore += 2
    homeScore.innerText = hscore
}

function guestPlusTwoBtn(){
    gscore += 2
    guestScore.innerText = gscore
}

function homePlusThreeBtn(){
    hscore += 3
    homeScore.innerText = hscore
}

function guestPlusThreeBtn(){
    gscore += 3
    guestScore.innerText = gscore
}

function reset(){
    gscore = 0
    hscore = 0
    guestScore.innerText = gscore
    homeScore.innerText = hscore
}