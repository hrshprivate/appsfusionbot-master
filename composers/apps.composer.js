const { Composer } = require('telegraf');
const { UserBot, Application } = require('../models')
const { myApps } = require('../utils/app');
const composer = new Composer()

composer.command('myapps', async ctx => {
    try{
       // console.log("My apps")
        const id = ctx.from.id
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'myapp'}})
        const apps = await Application.findOne({chatId: id})
        if(apps.applications.length){
           const page = 1
           const counterStart = 0
           const counterEnd = apps.applications.length < 3 ? apps.applications.length-1 : 2
           const appObj = await myApps(id, apps.applications, page, counterStart, counterEnd)
            for(let app of appObj){
                await ctx.bot.telegram.sendPhoto(ctx.chat.id, app.icon ,app.opts)
            }
        }else{
            await ctx.bot.telegram.sendMessage(ctx.chat.id, `Sorry, you have not added any app, let's /search some of them`)
        }
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR BLOCK USER")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
});

composer.hears('My apps', async ctx => {
    try{
      //  console.log("My apps")
        const id = ctx.from.id
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": 'myapp'}})
        const apps = await Application.findOne({chatId: id})
        if(apps.applications.length){
            const page = 1
            const counterStart = 0
            const counterEnd = apps.applications.length < 3 ? apps.applications.length-1 : 2
            const appObj = await myApps(id, apps.applications, page, counterStart, counterEnd)
             for(let app of appObj){
                // console.log(app.opts)
                 await ctx.bot.telegram.sendPhoto(ctx.chat.id, app.icon ,app.opts)
             }
        }else{
            await ctx.bot.telegram.sendMessage(ctx.chat.id, `Sorry, you have not added any app, let's /search some of them`)
        }
    }catch(err){
        if(err.response && err.response.error_code == 429){
            console.log("ERROR BLOCK USER")
        }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
    }
})



module.exports = composer