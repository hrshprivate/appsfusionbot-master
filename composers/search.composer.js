const { Composer } = require('telegraf')
const { UserBot } = require('../models')
const formCountriesMenu = require('../utils/formCountriesMenu')
const composer = new Composer()
const { Op } = require('sequelize')

composer.command('setcountry', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
    })
    const countries = formCountriesMenu()
    await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Choose country', countries)
    const test = await UserBot.Settings.update(
      { command: 'setcountry' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SET COUNTRY')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

composer.command('setstore', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
    })
    await ctx.bot.telegram.sendMessage(ctx.chat.id, `Choose searching store`, {
      reply_markup: {
        one_time_keyboard: false,
        keyboard: [
          [
            {
              text: 'App Store',
              callback_data: 'callback-btn-appstore',
            },
          ],
          [
            {
              text: 'Google Play',
              callback_data: 'callback-btn-googleplay',
            },
          ],
          [
            {
              text: 'Both',
              callback_data: 'callback-btn-mainmenu',
            },
          ],
        ],
      },
    })
    await UserBot.Settings.update(
      { command: 'setstore' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SET STORE ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer
