const { Telegraf } = require('telegraf')
var gplay = require('google-play-scraper')
const store = require('app-store-scraper')

const { Subscription, UserBot, AppReviews } = require('../models')
const clearStrings = require('./clearStrings')
const formRating = require('./formRating')
const { formMessage, formMessageGS } = require('./formMessage')
const { getAppId } = require('./checkTermLength')

require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN)

async function addNewSubscribtion(chatId, appId, storeName) {
  try {
    //  console.log("add New Subscribtion")
    const subscription = await Subscription.SubscriptionSchema.create({
      chatId: chatId,
      appId: appId,
      store: storeName,
      isSubscribe: true,
      reviews: [],
      lastReview: null,
      isRead: false,
    })
  } catch (err) {
    console.log(err)
  }
}

async function reviewsLoadMore(chatId, { appId, storeName }) {
  try {
    //  console.log("reviews load More", appId, storeName)
    const subscription = await Subscription.SubscriptionSchema.findOne({
      where: {
        chatId,
        appId: appId,
        store: storeName,
      },
    })

    const reviews = subscription.reviews
    const end =
      subscription.reviews.length < 3 ? subscription.reviews.length : 3
    for (let idx = 0; idx < end; idx++) {
      clearStrings(reviews[idx])
      const titleArray = reviews[idx]?.text.split(' ') || []
      const title =
        titleArray.length < 5
          ? titleArray.join(' ')
          : titleArray.slice(0, 5).join(' ')
      const rating = formRating(reviews[idx].score)
      const opts = formOpts()
      let message
      if (subscription.store === 'AS') {
        message = formMessage({ app: reviews[idx], title, rating })
      } else {
        message = formMessageGS({ app: reviews[idx], title, rating })
      }
      if (idx == end) await bot.telegram.sendMessage(chatId, message, opts)
      else await bot.telegram.sendMessage(chatId, message, opts)
    }
    if (reviews.length > end) {
      let app
      const appIdForSearch = await getAppId(appId)
      if (storeName === 'AS') {
        app = await store.app({ appId: appIdForSearch })
      } else {
        app = await gplay.app({ appId: appIdForSearch })
      }
      const opts = formOptsEnd(appId, storeName)
      await bot.telegram.sendMessage(
        chatId,
        `You have ${reviews.length - end} more new reviews for ${app.title}`,
        opts
      )
    }
    await Subscription.SubscriptionSchema.update(
      { end: end, reviews: subscription.reviews.slice(end) },
      {
        where: {
          chatId,
          appId: appId,
          store: storeName,
        },
      }
    )
  } catch (err) {
    console.log(err)
  }
}

function formOpts() {
  return {
    parse_mode: 'markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Translate',
            callback_data: JSON.stringify({
              state: 'tr',
            }),
          },
        ],
      ],
    },
  }
}

function formOptsEnd(appId, store) {
  return {
    parse_mode: 'markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Mark all reviews read for app',
            callback_data: JSON.stringify([appId, 'read', store]),
          },
        ],
        [
          {
            text: 'Press to load more',
            callback_data: JSON.stringify([appId, 'loadMore', store]),
          },
        ],
      ],
    },
  }
}

async function reviewsTimeTable(chatId, appId, storeName, user) {
  try {
    console.log('reviews Time Table')
    const subscription = await Subscription.SubscriptionSchema.findOne({
      where: {
        chatId,
        appId,
        store: storeName,
      },
    })
    //console.log()
    let appReviews = await AppReviews.AppReviewsSchema.findOne({
      where: { appId, store: storeName },
    })

    let reviews = appReviews.reviews

    let idxOfLastReview
    let lastReview = null
    if (subscription.lastReview) {
      for (let idx in reviews) {
        if (reviews[idx].id === subscription.lastReview) {
          idxOfLastReview = idx
          break
        }
      }
    }

    let reviewsForMessage = []
    if (idxOfLastReview && reviews.length) {
      reviewsForMessage = reviews.slice(0, idxOfLastReview)
      lastReview = reviews[0].id
    }
    if (!idxOfLastReview && reviews.length) {
      reviewsForMessage = reviews
      lastReview = reviews[0].id
      idxOfLastReview = 0
      await Subscription.SubscriptionSchema.update(
        { reviews: reviewsForMessage, lastReview: lastReview },
        {
          where: {
            chatId,
            appId: appId,
            store: storeName,
          },
        }
      )
      const userok = await UserBot.UserBotSchema.findOne({
        where: { chatId: chatId },
      })
      await UserBot.Settings.update(
        { command: 'subscription' },
        {
          where: {
            BotUserId: userok.id,
          },
        }
      )
      return
    }
    if (idxOfLastReview == 0 || !reviewsForMessage.length) {
      return
    } else {
      console.log('LAST INDEX - ', idxOfLastReview, subscription.reviews.length)
      let reviewsForMailing = reviewsForMessage.concat(subscription.reviews)
      let description, app
      if (subscription.store === 'AS') {
        app = await store.app({ appId: appId })
        description = `*${app.title}* \n\nReviews: *${appReviews.reviewsCount}* \nNew reviews: *${reviewsForMailing.length}* \nStore: *App Store*`
      } else {
        app = await gplay.app({ appId: appId })
        description = `*${app.title}* \n\nReviews: *${appReviews.reviewsCount}* \nNew reviews: *${reviewsForMailing.length}* \nStore: *Google Play*`
      }
      await bot.telegram.sendPhoto(chatId, app.icon, {
        caption: description,
        parse_mode: 'markdown',
      })

      let start = 0
      let end = reviewsForMailing.length < 3 ? reviewsForMailing.length : 3
      for (let idx = start; idx < end; idx++) {
        clearStrings(reviewsForMailing[idx])
        const titleArray = reviewsForMailing[idx]?.text.split(' ') || []
        const title =
          titleArray.length < 5
            ? titleArray.join(' ')
            : titleArray.slice(0, 5).join(' ')
        const rating = formRating(reviewsForMailing[idx].score)
        const opts = formOpts(idx, end, reviewsForMailing.length)
        let message
        if (subscription.store === 'AS') {
          message = formMessage({ app: reviewsForMailing[idx], title, rating })
        } else {
          message = formMessageGS({
            app: reviewsForMailing[idx],
            title,
            rating,
          })
        }
        if (idx == end) await bot.telegram.sendMessage(chatId, message, opts)
        else await bot.telegram.sendMessage(chatId, message, opts)
      }

      let newReviews = reviewsForMailing.slice(end)
      if (newReviews.length) {
        const opts = formOptsEnd(appId, storeName)
        await bot.telegram.sendMessage(
          chatId,
          `You have ${newReviews.length} more new reviews for ${app.title}`,
          opts
        )
      }
      await Subscription.SubscriptionSchema.update(
        { reviews: newReviews, lastReview: lastReview },
        {
          where: {
            chatId,
            appId: appId,
            store: storeName,
          },
        }
      )
      const userok = await UserBot.UserBotSchema.findOne({
        where: { chatId: chatId },
      })
      await UserBot.Settings.update(
        { command: 'subscription' },
        {
          where: {
            BotUserId: userok.id,
          },
        }
      )
    }
  } catch (err) {
    console.log(err)
  }
}

async function markAllReviewsRead(chatId, { appId, storeName }) {
  try {
    await Subscription.SubscriptionSchema.update(
      { reviews: [], end: 0 },
      {
        where: {
          chatId: chatId,
          appId: appId,
          store: storeName,
        },
      }
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  addNewSubscribtion,
  reviewsLoadMore,
  reviewsTimeTable,
  markAllReviewsRead,
}
