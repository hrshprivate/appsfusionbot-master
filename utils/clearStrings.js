function clearStrings(review){
   review.title = review.title?.replace(/[\*_]/g,"")
   review.userName = review.userName?.replace(/[\*_]/g,"")
   review.version = review.version?.replace(/[\*_]/g,"")
   review.text = review.text?.replace(/[\*_]/g,"")
}

module.exports = clearStrings