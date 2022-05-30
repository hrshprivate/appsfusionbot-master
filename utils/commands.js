const { UserBot, Feedback } = require('../models')
const formCountriesMenu = require('./formCountriesMenu');

async function setCountry(ctx, country){
    const countries = formCountriesMenu()
    await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Choose country', countries)
    await UserBot.findOneAndUpdate(
        {chatId: ctx.chat.id}, 
        {$set:{"settings.country": country,  "settings.command": null}},
        { returnOriginal: false }
    )
}

async function setFeedback(ctx, id){
    await Feedback.create({
        chatId: id,
        message: ctx.message.text 
    })
    await UserBot.updateOne({chatId: id}, {$set:{"settings.command": null}})
}

async function setStore(ctx, id){
    const message = ctx.message.text
    let store
    switch(message) {
        case 'App Store': 
        store = "APP_STORE"
        break
        case 'Google Play':
        store = "GOOGLE_PLAY"
        break
        case 'Both':
        store = "BOTH"
        break
        default:
        store = "BOTH"
        break
    }
    const updatedUser = await UserBot.findOneAndUpdate(
        {chatId: id}, 
        {$set:{"settings.store": store, "settings.command": null}},
        { new: true }
    )
    return updatedUser
}

async function preSearch(id){
    await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'search'}})
}

module.exports={
    setCountry,
    setFeedback,
    setStore,
    preSearch
}