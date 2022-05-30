const { Composer } = require('telegraf')
const { UserBot } = require('../models')
const formCountriesMenu = require('../utils/formCountriesMenu')
const composer = new Composer()

composer.command('setcountry', async ctx => {
    try{
        const id = ctx.from.id
        const countries = formCountriesMenu()
        await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Choose country', countries)
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'setcountry'}})
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR SET COUNTRY")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})

composer.command('setstore', async ctx => {
    try{
        const id = ctx.from.id
        await ctx.bot.telegram.sendMessage(ctx.chat.id, `Choose searching store`, {
            "reply_markup": {
                "one_time_keyboard": false,
                "keyboard": [
                    [{
                        text: "App Store",
                        callback_data: "callback-btn-appstore"
                    }],
                    [{
                        text: "Google Play",
                        callback_data: "callback-btn-googleplay"
                    }],
                    [{
                        text: "Both",
                        callback_data: "callback-btn-mainmenu"
                    }]
                ]
            }
        })
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'setstore'}})
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR SET STORE ")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})


module.exports = composer