const { COUNTRIES } = require("../constants")

function formCountriesMenu(){
    const countriesMenu = {
        "reply_markup": {
            "one_time_keyboard": true,
            "resize_keyboard": true,
            "keyboard": []
        }
    } 
 
    for(let country of Object.keys(COUNTRIES)){
        countriesMenu["reply_markup"]["keyboard"].push(
        [{
            text: country
        }],
       )
    
   }
   return countriesMenu
}

module.exports = formCountriesMenu