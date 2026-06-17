function generatePassword(){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";

    for(let i = 0; i < 16; i++){
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("passwordField").value = password;
}