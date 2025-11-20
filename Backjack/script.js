
let cards = []
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.getElementById("sum")
let cardsEl = document.getElementById("cards-el")

//Objects are complex data types and key-value pairs
let player = {
  name : "Yahboy",
  chips : 143
}

let playerDetails = document.getElementById("player")
playerDetails.textContent = player.name + ": $" + player.chips

function getRandomCard(){
  let random = Math.floor(Math.random() * 13) + 1
  if (random > 10){
    return 10
  } else if ( random === 1){
    return 11
  } else{
    return random
  }
  
}

function startGame(){
  let firstCard = getRandomCard()
  let secondCard = getRandomCard()
  cards = [firstCard, secondCard]
  sum = firstCard + secondCard;
  isAlive = true
  renderGame()
}

function renderGame() {
  
  document.querySelector("#sum").innerText = sum;
  cardsEl.textContent = "Cards: "
  for (let i = 0; i < cards.length; i++){
    cardsEl.textContent += cards[i] + " "
  }
  sumEl.textContent = sum

  if (sum < 21) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "Wohoo You've got Blackjack!";
    hasBlackJack = true;
  } else {
    message = "You are out!";
    isAlive = false;
  }
  messageEl.innerText = message;
}

function newCard(){
  if (isAlive === true && hasBlackJack === false){
    let card = getRandomCard()
    cards.push(card)
    sum +=  card
    renderGame()
  }
}


//other 


