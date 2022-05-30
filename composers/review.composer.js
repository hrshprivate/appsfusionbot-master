const { Composer } = require('telegraf')
const { COUNTRIES_HEARS, COUNTRIES } = require('../constants')
const { reviewsByCountryAS, reviewsByRatingAS} = require('../utils/reviewsAppStore')
const { reviewsByCountryGS, reviewsByRatingGS} = require('../utils/reviewsGoogle')
const { preSearch } = require('../utils/commands')
const { UserBot } = require('../models')
const { formMessageForSearch } = require('../utils/formMessage')
const composer = new Composer()

composer.hears(COUNTRIES_HEARS , async ctx => {
    try{
        const id = ctx.from.id
        const user = await UserBot.findOne({chatId: id})
        if(user.settings.command === "reviewCountry"){
            if(user.currentApp.store === 'AS'){
                const countryCode = COUNTRIES[ctx.message.text][0]
                const appId = user.currentApp.appId
              //  console.log(`GET REVIEWS ${appId} BY ${countryCode} `)
                await reviewsByCountryAS(ctx, 1 , 1, appId, user, countryCode)
            }else{
                const countryCode = COUNTRIES[ctx.message.text][1]
                const appId = user.currentApp.appId
               // console.log(`GET REVIEWS ${appId} BY ${countryCode} `)
                await reviewsByCountryGS(ctx, appId, null, countryCode)
            }
        }else if(user.settings.command === "setcountry"){
            const updatedUser = await UserBot.findOneAndUpdate(
                {chatId: ctx.chat.id},
                { $set:
                    {
                      "settings.country": ctx.message.text,
                      "settings.command": 'search'
                    }
                },
                {new: true})
            const message = formMessageForSearch(updatedUser, ctx)
            await ctx.bot.telegram.sendMessage(
                 ctx.chat.id, 
                 message,
                 ctx.searchMenu)
        }else{
            const message = formMessageForSearch(user, ctx)
            await ctx.bot.telegram.sendMessage(
                ctx.chat.id, 
                message,
                ctx.searchMenu)
            await preSearch(id)
        }
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("SET COUNTRY ")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})

composer.hears(['1','2','3','4', '5'], async ctx => {
    try{
        const id = ctx.from.id
        const user = await UserBot.findOne({chatId: id})
        const appId = user.currentApp.appId
        const score = ctx.message.text
        if(user.settings.command === "reviewRating"){
            if(user.currentApp.store === 'AS'){
               // console.log("REVIEWS BY RATING AS")
                await reviewsByRatingAS(ctx, 1, appId, score )
            }else{
               // console.log("REVIEWS BY RATING GS")
                await reviewsByRatingGS(ctx, 1, appId, score )
            }
        }else{
            const message = formMessageForSearch(user, ctx)
            await ctx.bot.telegram.sendMessage(
                ctx.chat.id, 
                message,
                ctx.searchMenu)
            await preSearch(id)
        }
    }catch(err){
        console.log(err)
        if(err.response && err.response.error_code == 429){
            console.log("ERROR SET RAITING ")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})


module.exports = composer