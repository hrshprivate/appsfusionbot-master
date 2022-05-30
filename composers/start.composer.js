const { Composer } = require('telegraf')
const { UserBot, Application } = require('../models')
const composer = new Composer()

composer.command('start', async ctx => {
  try{
    const user = await UserBot.findOne({chatId: ctx.from.id})
    if(!user){
      await UserBot.create({ 
        chatId: ctx.from.id,
        firstName: ctx.from?.first_name,
        lastName: ctx.from?.last_name,
        username: ctx.from?.username,
        subscription:{
          isTrial: true,
          isSubscribe: false,
          days: 0,
          plan: 'CREW',
          apps: 0
        },
        settings: {
          command: null,
          store: 'APP_STORE',
          country: "United States of America"
        },
        currentApp:{
          appId: null,
          country: null,
          store: null,
          nextPaginationToken: null
        }
      });
    }
    
    const apps = await Application.findOne({chatId: ctx.from.id})
    if(!apps){
      await Application.create({ chatId: ctx.from.id, applications: []})
    }
    ctx.setMyCommands([
        {
          command: '/start',
          description: 'Start using bot for watching for reviews',
        },
        {
          command: '/search',
          description: 'Search for app in Appstore by query',
        },
        {
          command: '/myapps',
          description: 'List my apps',
        },
        {
          command: '/feedback',
          description: 'Leave a feedback',
        },
      ])
    ctx.getMyCommands()
    await ctx.reply(ctx.i18n.t('welcome_first'))
    await ctx.reply(ctx.i18n.t('welcome_second'))
    await ctx.reply(ctx.i18n.t('welcome_third'))
    await ctx.reply(ctx.i18n.t('welcome_fourth'), ctx.mainMenu)
  }catch(err){
    if(err.response && err.response.error_code == 429){
      console.log("ERROR START ")
    }else await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer