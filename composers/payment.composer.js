const { Composer } = require('telegraf')
const { UserBot, AgendaJobs, Subscription } = require('../models')
const composer = new Composer()
const  agenda  = require('../services/agenda/index');

composer.on('pre_checkout_query', (ctx) => {
   return ctx.answerPreCheckoutQuery(true)
 })

composer.on('successful_payment', async (ctx) => {
    try{
        const chatId = ctx.update.message.chat.id
        let plan
        switch (ctx.update.message.successful_payment.total_amount) {
            case 400:
                plan = 'BASIC'
                break;
            case 700:
                plan = "MINI"
                break;
            default:
                plan = "CREW"
                break;
        }
    
    
        await  AgendaJobs.deleteMany({
            name: "bot-subscription",
            "data.id": chatId,
        })
        
        const user =  await UserBot.findOne({chatId})
        if(user.subscription.plan === plan ){
            await UserBot.findOneAndUpdate(
                { chatId },
                { 
                    "isTreal": false,
                    "subscription.isSubscribe": true,
                    "subscription.plan": plan,
                    $inc : { "subscription.days" : +31 }
                })
        }else{
            await UserBot.findOneAndUpdate(
                { chatId },
                { 
                    "isTreal": false,
                    "subscription.isSubscribe": true,
                    "subscription.plan": plan,
                    "subscription.days" : 31 
                })
        }
        await Subscription.updateMany(
            {chatId},
            {isSubscribe: true})
        
        const dayReport = agenda.create("bot-subscription", { id: chatId });
        await dayReport.repeatEvery('1 day').save();
        await ctx.reply('Successful Payment')
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR MENU ")
        }else await ctx.reply('Something went wrong...')
    }
})



module.exports = composer

