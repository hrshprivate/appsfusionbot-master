const gplay = require('google-play-scraper')
const clearStrings = require('./clearStrings')
const { UserBot, AppReviews } = require('../models')
const { COUNTRIES } = require('../constants')
const { getAppId } = require('./checkTermLength')

async function reviewsByCountryGS(ctx, appId, nextPaginationToken, country) {
  try {
    const appIdForSearch = await getAppId(appId)
    const apps = await gplay.reviews({
      appId: appIdForSearch,
      num: 3,
      sort: gplay.sort.NEWEST,
      paginate: true,
      country: country,
      nextPaginationToken: nextPaginationToken,
    })

    const newPaginationToken = apps.nextPaginationToken
    const user2 = await UserBot.UserBotSchema.findOne({
      where: { chatId: ctx.chat.id },
      include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
    })
    await UserBot.CurrentApp.update(
      { country: country, nextPaginationToken: newPaginationToken },
      {
        where: {
          BotUserId: user2.id,
        },
      }
    )
    if (!apps.data[0])
      return ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        'There is no reviews by your query...'
      )
    for (let idx in apps.data) {
      clearStrings(apps.data[idx])
      const rating = formRating(apps.data[idx].score)
      const titleArray = apps.data[idx]?.text?.split(' ') || []
      const title =
        titleArray.length < 5
          ? titleArray.join(' ')
          : titleArray.slice(0, 5).join(' ')
      const opts = formOpts(
        idx,
        apps.data.length - 1,
        appId,
        newPaginationToken
      )
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('reviewLast', { app: apps.data[idx], title, rating }),
        opts
      )
    }
  } catch (err) {
    console.log(err)
    await (ctx.chat.id, 'Something went wrong...')
  }
}

async function lastReviewsGS(ctx, page, appId) {
  const app = await AppReviews.AppReviewsSchema.findOne({
    where: { appId: appId, store: 'GS' },
  })
  // console.log("All reviews gs - ",reviews.length,"Reviews by rating - ", sampleByRating.length)
  const reviews = app.reviews.map((elem) => {
    elem.date = new Date(elem.date)
    return elem
  })
  reviews.sort((a, b) => b.date - a.date)
  const start = page * 3 - 3
  const end = page * 3 - 1
  // console.log("START - ",start, "END - ", end)
  for (let idx = start; idx <= end; idx++) {
    if (!reviews[idx] && idx == start)
      ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        'There is no reviews by your query...'
      )
    if (!reviews[idx]) return
    clearStrings(reviews[idx])
    const titleArray = reviews[idx]?.text.split(' ') || []
    const title =
      titleArray.length < 5
        ? titleArray.join(' ')
        : titleArray.slice(0, 5).join(' ')
    const rating = formRating(reviews[idx].score)
    const opts = formOptsForRating(page, appId, end, idx, (score = 0), reviews)
    if (idx == end)
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: reviews[idx], title, rating }),
        opts
      )
    else
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: reviews[idx], title, rating }),
        opts
      )
  }
}

async function reviewsByRatingGS(ctx, page, appId, score) {
  const app = await AppReviews.AppReviewsSchema.findOne({
    where: { appId: appId, store: 'GS' },
  })
  const sampleByRating = app.reviews.reduce((acc, curr) => {
    return curr.score == score ? [...acc, curr] : acc
  }, [])
  // console.log("All reviews gs - ",reviews.length,"Reviews by rating - ", sampleByRating.length)

  const reviews = sampleByRating.map((elem) => {
    elem.date = new Date(elem.date)
    return elem
  })
  reviews.sort((a, b) => b.date - a.date)

  const start = page * 3 - 3
  const end = page * 3 - 1
  // console.log("START - ",start, "END - ", end)
  for (let idx = start; idx <= end; idx++) {
    if (!reviews[idx] && idx == start)
      ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        'There is no reviews by your query...'
      )
    if (!reviews[idx]) return
    clearStrings(reviews[idx])
    const titleArray = reviews[idx]?.text.split(' ') || []
    const title =
      titleArray.length < 5
        ? titleArray.join(' ')
        : titleArray.slice(0, 5).join(' ')
    const rating = formRating(reviews[idx].score)
    const opts = formOptsForRating(page, appId, end, idx, score, reviews)
    if (idx == end)
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: reviews[idx], title, rating }),
        opts
      )
    else
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: reviews[idx], title, rating }),
        opts
      )
  }
}

function formOpts(idxStart, idxEnd, appId, newPaginationToken) {
  if (idxEnd == idxStart && newPaginationToken) {
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
          [
            {
              text: 'Next',
              callback_data: JSON.stringify([appId, 'next']),
            },
          ],
        ],
      },
    }
  } else {
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
}

function formOptsForRating(page, appId, end, idx, score, reviews) {
  if (end === idx && reviews[idx + 1]) {
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
          [
            {
              text: 'Next',
              callback_data: JSON.stringify([appId, 'next', page + 1, score]),
            },
          ],
        ],
      },
    }
  } else {
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
}

function formRating(rating) {
  const starBlack = '★'
  const starWhite = '☆'
  let ratingGraphic = ''
  for (let score = 0; score < 5; score++) {
    if (score >= rating) ratingGraphic += starWhite
    else ratingGraphic += starBlack
  }
  return ratingGraphic
}

module.exports = {
  reviewsByCountryGS,
  reviewsByRatingGS,
  lastReviewsGS,
}
