const mongoose = require("mongoose");
const { UserBot, Application, AgendaJobs, Subscription,  } = require('../../models')



mongoose.connect("mongodb://localhost:27017/apps-fusion-bot-dev-db", { useUnifiedTopology: true, useNewUrlParser: true });
 
async function run(){
const users = await UserBot.find({"subscription.days": {$lte: -1 }})
const chatIds = users.map(user => { return user.chatId})

await AgendaJobs.deleteMany({
    name: "bot-subscription", "data.id": { $in: chatIds}
})

for(let chatId of chatIds){
    const subscriptions = await Subscription.find({chatId})
    console.log("Subscriptions - ",subscriptions?.length)
    await Subscription.updateMany({chatId}, {isSubscribe: false})
    await UserBot.findOneAndUpdate({chatId}, {
        'subscription.apps': subscriptions?.length,
        "subscription.days": 0,
        "subscription.isSubscribe": false,
        "subscription.isTrial": false
    
    })
}

const users2Step = await UserBot.find()
const chatIds2Step = users2Step.map(user => { return user.chatId})
for(let chatId of chatIds2Step){
    const jons =  await AgendaJobs.find({
        name: "bot-subscription", "data.id": chatId
    })
    if(jons?.length > 1) {
        console.log(jons?.length)
        for(let start = 1; start<jons?.length; start++){
            console.log(jons[start])
            await AgendaJobs.findOneAndDelete({"_id": jons[start]._id }) 
        }
    }
    const subscriptions = await Subscription.find({chatId})
    const userFind = await UserBot.findOne({chatId:chatId })
    console.log(chatId, userFind.
        subscription.isTrial, userFind.
        subscription.isSubscribe, subscriptions?.length )
    if(userFind.subscription.isTrial === true 
        && userFind.subscription.isSubscribe === false
        && subscriptions?.length >= 1){

        await UserBot.findOneAndUpdate({chatId}, {
            'subscription.apps': subscriptions?.length,
            "subscription.isTrial": false,
            "subscription.isSubscribe": true
        
        })
    }
    if(userFind.subscription.isTrial === true 
        && userFind.subscription.isSubscribe === true){
            await UserBot.findOneAndUpdate({chatId}, {
                'subscription.apps': subscriptions?.length,
                "subscription.isTrial": false,
                "subscription.isSubscribe": true
            
            })  
        }
    await UserBot.findOneAndUpdate({chatId}, {
        'subscription.apps': subscriptions?.length,
    })
}



mongoose.disconnect();

}
run()
