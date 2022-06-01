const { Composer } = require('telegraf')
const { PLAN_CREW, PLAN_MINI, PLAN_BASIC } = require('../constants')
const { UserBot, Subscription } = require('../models')
const { preSearch } = require('../utils/commands')
const { formMessageForSearch } = require('../utils/formMessage')
const composer = new Composer()
const { Op } = require('sequelize')

composer.hears('Subscription', async (ctx) => {
  try {
    const id = ctx.from.id
    const user = await UserBot.UserBotSchema.findOne({
      where: { chatId: id },
      include: [UserBot.Settings, UserBot.CurrentApp, UserBot.Subscription],
    })
    const subscriptions = await Subscription.SubscriptionSchema.findOne({
      where: { chatId: id },
    })
    if (user.settings[0].command !== 'search') {
      if (subscriptions.length) {
        if (user.subscription.days == 0) {
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            ctx.i18n.t('endPeriod')
          )
        } else {
          if (user.subscription[0].isTrial === true)
            await ctx.bot.telegram.sendMessage(
              ctx.chat.id,
              ctx.i18n.t('trialPeriod', { days: user.subscription.days })
            )
          else
            await ctx.bot.telegram.sendMessage(
              ctx.chat.id,
              ctx.i18n.t('subPeriod', { days: user.subscription.days })
            )
        }
        await ctx.bot.telegram.sendMessage(ctx.chat.id, ctx.i18n.t('selectSub'))
      } else if (
        !subscriptions.length &&
        user.subscription[0].isTrial === true
      ) {
        await ctx.bot.telegram.sendMessage(
          ctx.chat.id,
          ctx.i18n.t('withoutSub')
        )
      }

      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('crew'),
        PLAN_CREW
      )
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('mini'),
        PLAN_MINI
      )
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('basic'),
        PLAN_BASIC
      )
    } else {
      const message = formMessageForSearch(user, ctx)
      await ctx.bot.telegram.sendMessage(ctx.chat.id, message, ctx.searchMenu)
      await preSearch(id)
    }
  } catch (err) {
    if (err.response && err.response.error_code == 429) {
      console.log('ERROR SUBSCRIPTION HEATS')
    } else
      await ctx.bot.telegram.sendMessage(ctx.chat.id, 'Something went wrong...')
  }
})

module.exports = composer
