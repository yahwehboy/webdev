let currentTicketNumber = 0

function getNextTicketNumber(){
    //return currentTicketNumber++
    //instead we should move the increment to the front of the variable to remove the 0 ticket
    return ++currentTicketNumber //we could use --
}

console.log(getNextTicketNumber())
console.log(getNextTicketNumber())
console.log(getNextTicketNumber())