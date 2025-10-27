const heart = document.getElementById("heart")
function heartChange(heart){
    heart = document.getElementById("heart")
    if (heart.classList.contains('fa-heart-o')){
        heart.classList.replace('fa-heart-o', 'fa-heart')
    } else if (heart.classList.contains('fa-heart')){
        heart.classList.replace('fa-heart', 'fa-heart-o')
    }
}