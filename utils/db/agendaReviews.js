const mongoose = require("mongoose");
const { Subscription, AppReviews } = require("../../models");
const agenda = require("../../services/agenda");


mongoose.connect("mongodb://localhost:27017/apps-fusion-bot-dev-db", { useUnifiedTopology: true, useNewUrlParser: true });
 
async function run(){
    const subscriptions = await Subscription.find()
    const appsAndStores = subscriptions.map((sub)=> {return {appId: sub.appId, store: sub.store}})
    const tempArray = []
    appsAndStores.forEach(elem1=>{
        let check = false
        tempArray.forEach(elem2=>{
            if(elem1.appId == elem2.appId && elem1.store == elem2.store) check = true
        })
        if(!check) tempArray.push(elem1)
    })
    console.log(tempArray)
    for(let subscription of tempArray){
        const appReviews = await AppReviews.create({
            appId: subscription.appId,
            store: subscription.store
        })
        const app = await agenda.create("app-reviews", { 
            appId: subscription.appId,
            store: subscription.store,
            reviewsId: appReviews.id,
        });
        await app.repeatEvery('60 minutes').save();
    }
    console.log("Finished")
    mongoose.disconnect();
}
run()
