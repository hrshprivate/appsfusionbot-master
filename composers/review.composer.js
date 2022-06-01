const { Composer } = require('telegraf')
const { COUNTRIES_HEARS, COUNTRIES } = require('../constants')
const { Op } = require('sequelize')
const {
  reviewsByCountryAS,
  reviewsByRatingAS,
} = require('../utils/reviewsAppStore')
const {
  reviewsByCountryGS,
  reviewsByRatingGS,
} = require('../utils/reviewsGoogle')
const { preSearch } = require('../utils/commands')
const { UserBot } = require('../models')
const { formMessageForSearch } = require('../utils/formMessage')
const composer = new Composer()

composer.hears(COUNTRIES_HEARS, async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.Settings, UserBot.CurrentApp, UserBot.Subscription],
    })
    if (user.settings[0].command === 'reviewCountry') {
      if (user.currentApps[0].store === 'AS') {
        const countryCode = COUNTRIES[ctx.message.text][0]
        const appId = user.currentApps[0].appId
        console.log(`${appId} - eto ploho`)
        //  console.log(`GET REVIEWS ${appId} BY ${countryCode} `)
        await reviewsByCountryAS(ctx, 1, 1, appId, user, countryCode)
      } else {
        const countryCode = COUNTRIES[ctx.message.text][1]
        const appId = user.currentApps[0].appId
        // console.log(`GET REVIEWS ${appId} BY ${countryCode} `)
        await reviewsByCountryGS(ctx, appId, null, countryCode)
      }
    } else if (user.settings[0].command === 'setcountry') {
      // const updatedUser = await UserBot.Settings.update(
      //   { chatId: ctx.chat.id },
      //   {
      //     $set: {
      //       'settings.country': ctx.message.text,
      //       'settings.command': 'search',
      //     },
      //   },
      //   { new: true }
      // )
      console.log(`asdasdasda`)
      const updatedUser = await UserBot.Settings.update(
        {
          country: ctx.message.text,
          command: 'search',
        },
        {
          where: {
            BotUserId: user.id,
            // [Op.and]: [{ BotUserId: user.id }, { chatId: chatId }]
          },
        }
      )
      const message = formMessageForSearch(updatedUser, ctx)
      await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
    } else {
      const message = formMessageForSearch(user, ctx)
      await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
      await preSearch(id)
    }
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('SET COUNTRY ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

composer.hears(['1', '2', '3', '4', '5'], async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.Settings, UserBot.CurrentApp, UserBot.Subscription],
    })
    const appId = user.currentApps[0].appId
    const score = ctx.message.text
    if (user.settings[0].command === 'reviewRating') {
      if (user.currentApps[0].store === 'AS') {
        // console.log("REVIEWS BY RATING AS")
        await reviewsByRatingAS(ctx, 1, appId, score)
      } else {
        // console.log("REVIEWS BY RATING GS")
        await reviewsByRatingGS(ctx, 1, appId, score)
      }
    } else {
      const message = formMessageForSearch(user, ctx)
      await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
      await preSearch(id)
    }
  } catch (err) {
    console.log(err)
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SET RAITING ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer
