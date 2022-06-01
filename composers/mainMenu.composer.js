const { Composer } = require('telegraf')
const { UserBot } = require('../models')
const { formMessageForSearch } = require('../utils/formMessage')
const composer = new Composer()
const { Op } = require('sequelize')

composer.command('mainmenu', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({ where: { chatId: id } })
    await ctx.bot.telegram.sendMessage(
      ctx.chat.id,
      `I'm waiting for your next move...`,
      ctx.mainMenu
    )
    await UserBot.UserBotSchema.update(
      { command: 'mainmenu' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR MENU ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

composer.hears('Leave feedback', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({ where: { chatId: id } })
    await UserBot.Settings.update(
      { command: 'feedback' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
    await ctx.bot.telegram.sendMessage(
      ctx.chat.id,
      `Please, type your feedback`
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR FEEDBACK HEARS ')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

composer.command('feedback', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({ where: { chatId: id } })
    await ctx.bot.telegram.sendMessage(
      ctx.chat.id,
      `Please, type your feedback`
    )
    await UserBot.Settings.update(
      { command: 'feedback' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    console.log('ERROR FEDDBACK COMMAND - ', err)
    //  await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...g')
  }
})

composer.command('search', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.Settings, UserBot.Subscription, UserBot.CurrentApp],
    })
    const message = formMessageForSearch(user, ctx)
    await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
    await UserBot.Settings.update(
      { command: 'search' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SEARCH COMMAND')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

composer.hears('Search', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.Settings, UserBot.Subscription, UserBot.CurrentApp],
    })
    const message = formMessageForSearch(user, ctx)
    await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
    await UserBot.Settings.update(
      { command: 'search' },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SEARCH HEARS')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer
