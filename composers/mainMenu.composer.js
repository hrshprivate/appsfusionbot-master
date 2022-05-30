const { Composer } = require('telegraf')
const { UserBot } = require('../models')
const { formMessageForSearch } = require('../utils/formMessage')
const composer = new Composer()

composer.command('mainmenu', async ctx => {
    try{
        const id = ctx.from.id
        await ctx.bot.telegram.sendMessage(ctx.chat.id, `I'm waiting for your next move...`, ctx.mainMenu)
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'mainmenu'}})
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR MENU ")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})

composer.hears('Leave feedback', async ctx => {
    try{
        const id = ctx.from.id
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'feedback'}})
        await ctx.bot.telegram.sendMessage(ctx.chat.id, `Please, type your feedback`)
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR FEEDBACK HEARS ")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})

composer.command('feedback', async ctx => {
    try{
        const id = ctx.from.id
        await ctx.bot.telegram.sendMessage(ctx.chat.id, `Please, type your feedback`)
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'feedback'}})
    }catch(err){
        console.log("ERROR FEDDBACK COMMAND - ", err)
      //  await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...g')
    }
}) 

composer.command('search', async ctx => {
    try{
        const id = ctx.from.id
        const user = await UserBot.findOne({chatId: id})
        const message = formMessageForSearch(user, ctx)
        await ctx.bot.telegram.sendMessage(
            ctx.chat.id, 
            message,
            ctx.searchMenu)
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'search'}})
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR SEARCH COMMAND")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})

composer.hears('Search', async ctx => {
    try{
        const id = ctx.from.id
        const user = await UserBot.findOne({chatId: id})
        const message = formMessageForSearch(user, ctx)
        await ctx.bot.telegram.sendMessage(
            ctx.chat.id, 
            message,
            ctx.searchMenu)
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'search'}})
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR SEARCH HEARS")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    } 
})



module.exports = composer