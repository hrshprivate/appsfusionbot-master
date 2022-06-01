const { Composer } = require('telegraf')
const { UserBot, Application } = require('../models')
const composer = new Composer()
const { Op } = require('sequelize')

composer.command('start', async (ctx) => {
  try {
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: ctx.from.id },
      include: [UserBot.Subscription, UserBot.Settings, UserBot.CurrentApp],
    })
    if (!user) {
      const USER = await UserBot.UserBotSchema.create({
        chatId: ctx.from.id,
        firstName: ctx.from?.first_name,
        lastName: ctx.from?.last_name,
        username: ctx.from?.username,
      })
      const Sub = await UserBot.Subscription.create({
        isTrial: true,
        isSubscribe: false,
        days: 0,
        plan: 'CREW',
        apps: 0,
        BotUserId: USER.id,
      })
      const Set = await UserBot.Settings.create({
        command: null,
        store: 'APP_STORE',
        country: 'United States of America',
        BotUserId: USER.id,
      })
      const Cup = await UserBot.CurrentApp.create({
        appId: null,
        country: null,
        store: null,
        nextPaginationToken: null,
        BotUserId: USER.id,
      })
    }
    const testing = await UserBot.UserBotSchema.findOne({
      where: { id: 1 },
      include: [UserBot.Settings, UserBot.Subscription, UserBot.CurrentApp],
    })
    console.log(testing.currentApps[0].id) // почему в доках по-другому))))
    const apps = await Application.ApplicationSchema.findOne({
      where: { chatId: ctx.from.id },
    })
    if (!apps) {
      await Application.ApplicationSchema.create({
        chatId: ctx.from.id,
        applications: [],
      })
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
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR START ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer
