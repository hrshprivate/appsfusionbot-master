function formRating(rating){
    const starBlack = '★'
    const starWhite = '☆'
    let ratingGraphic = ''
    for(let score = 0; score < 5; score++){
        if(score >= rating) ratingGraphic += starWhite
        else ratingGraphic += starBlack
    }
    return ratingGraphic
}

module.exports = formRating