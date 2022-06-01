const { UserBot, Feedback } = require('../models')
const formCountriesMenu = require('./formCountriesMenu')

async function setCountry(ctx, country) {
  console.log('aaaaaBBBBBB')
  const countries = formCountriesMenu()
  await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Choose country', countries)
  const user = await UserBot.UserBotSchema.findOne({
    where: { chatId: ctx.chat.id },
  })
  await UserBot.Settings.update(
    { command: 'search' },
    {
      where: {
        BotUserId: user.id,
      },
    }
  )
}

async function setFeedback(ctx, id) {
  await Feedback.FeedbackSchema.create({
    chatId: id,
    message: ctx.message.text,
  })
  await UserBot.Settings.update(
    { command: null },
    {
      where: {
        BotUserId: id,
      },
    }
  )
}

async function setStore(ctx, id) {
  const message = ctx.message.text
  const user = await UserBot.UserBotSchema.findOne({ where: { chatId: id } })
  let store
  switch (message) {
    case 'App Store':
      store = 'APP_STORE'
      break
    case 'Google Play':
      store = 'GOOGLE_PLAY'
      break
    case 'Both':
      store = 'BOTH'
      break
    default:
      store = 'BOTH'
      break
  }
  const updatedUser = await UserBot.Settings.update(
    { command: 'search', store: store },
    {
      where: {
        BotUserId: user.id,
      },
    }
  )
  return updatedUser
}

async function preSearch(id) {
  const user = await UserBot.UserBotSchema.findOne({ where: { chatId: id } })
  await UserBot.Settings.update(
    { command: 'search' },
    {
      where: {
        BotUserId: user.id,
      },
    }
  )
}

module.exports = {
  setCountry,
  setFeedback,
  setStore,
  preSearch,
}
