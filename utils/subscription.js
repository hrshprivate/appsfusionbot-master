const { Subscription, AgendaJobs } = require("../models");


require('dotenv').config();

async function unSubscribe(chatId, appId, store){
    try{
        await AgendaJobs.findOneAndDelete({
            name: "app-subscription",
            "data.chatId":chatId,
            "data.appId": appId,
            "data.store": store})
        
        await Subscription.findOneAndUpdate(
            {chatId, appId, store},
            {isSubscribe: false}
        )
    }catch(err){
        console.log(err)
    }
}

async function subscribe(chatId, appId, store, user){
    try{
        await Subscription.findOneAndUpdate(
            {chatId, appId, store},
            {isSubscribe: true}
        )
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    unSubscribe,
    subscribe
}