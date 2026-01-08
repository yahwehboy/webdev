function checkUsername(username){
    if (username){
        console.log(username)
    } else {
        throw new Error("No username provided")
    }
}

checkUsername()


//other types of constructor
//String()
//Number()
//Array()
//Object()
//Boolean()