const store = require('app-store-scraper')
const { COUNTRIES } = require('../constants')
const { AppReviews } = require('../models')
const { getAppId } = require('./checkTermLength')
const clearStrings = require('./clearStrings')

async function reviewsByCountryAS(
  ctx,
  realPage,
  currPage,
  appId,
  user,
  country = null
) {
  try {
    let page = realPage
    let start = (currPage - 17 * (realPage - 1)) * 3 - 3
    let end =
      (currPage * 3 - 1) % 50 == 0
        ? (currPage - 17 * (realPage - 1)) * 3 - 2
        : (currPage - 17 * (realPage - 1)) * 3 - 1
    if (end == 50) end = 49
    const test = [18, 35, 52, 69, 86, 103, 120, 137, 154, 171]
    if (currPage % test[realPage - 1] == 0) {
      page = page + 1
      start = 0
      end = 2
    }
    //console.log('Страница по счетчику - ', currPage, "Реальная страница - ",page, country || COUNTRIES[user.settings.country][0])
    const appStoreCountry = country || COUNTRIES[user.settings[0].country][0]
    const appIdForSearch = await getAppId(appId)
    const reviews = await store.reviews({
      appId: appIdForSearch,
      country: appStoreCountry,
      page: page,
    })

    for (let idx = start; idx <= end; idx++) {
      // console.log("START - ",start, "END - ", end, "IDX - ",idx)
      if (!reviews[idx] && idx == start)
        await ctx.bot.telegram.sendMessage(
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
      const opts = formOpts(
        currPage,
        end,
        idx,
        page,
        appId,
        appStoreCountry,
        reviews
      )
      if (idx == end)
        await ctx.bot.telegram.sendMessage(
          ctx.chat.id,
          ctx.i18n.t('reviewLast', { app: reviews[idx], title, rating }),
          opts
        )
      else
        await ctx.bot.telegram.sendMessage(
          ctx.chat.id,
          ctx.i18n.t('reviewLast', { app: reviews[idx], title, rating }),
          opts
        )
    }
  } catch (err) {
    await ctx.bot.telegram.sendMessage(
      ctx.chat.id,
      'There is no reviews by your query...',
      ctx.mainMenu
    )
    console.log(err)
  }
}

async function lastReviewsAS(ctx, page, appId) {
  const app = await AppReviews.AppReviewsSchema.findOne({
    where: { appId: appId, store: 'AS' },
  })
  const reviews = app.reviews
  // console.log("All reviews as - ",reviews.length,"Reviews by rating - ", sampleByRating.length)
  const start = page * 3 - 3
  const end = page * 3 - 1
  for (let idx = start; idx <= end; idx++) {
    if (!reviews[idx] && idx == start)
      await ctx.bot.telegram.sendMessage(
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
    const opts = formOptsForRating(
      page,
      appId,
      end,
      idx,
      (score = null),
      reviews
    )
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

async function reviewsByRatingAS(ctx, page, appId, score) {
  const app = await AppReviews.AppReviewsSchema.findOne({
    where: { appId: appId, store: 'AS' },
  })
  const sampleByRating = app.reviews.reduce((acc, curr) => {
    return curr.score == score ? [...acc, curr] : acc
  }, [])
  // console.log("All reviews as - ",reviews.length,"Reviews by rating - ", sampleByRating.length)

  const start = page * 3 - 3
  const end = page * 3 - 1
  for (let idx = start; idx <= end; idx++) {
    if (!sampleByRating[idx] && idx == start)
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        'There is no reviews by your query...'
      )
    if (!sampleByRating[idx]) return
    clearStrings(sampleByRating[idx])
    const titleArray = sampleByRating[idx]?.text.split(' ') || []
    const title =
      titleArray.length < 5
        ? titleArray.join(' ')
        : titleArray.slice(0, 5).join(' ')
    const rating = formRating(sampleByRating[idx].score)
    const opts = formOptsForRating(page, appId, end, idx, score, sampleByRating)
    if (idx == end)
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: sampleByRating[idx], title, rating }),
        opts
      )
    else
      await ctx.bot.telegram.sendMessage(
        ctx.chat.id,
        ctx.i18n.t('review', { app: sampleByRating[idx], title, rating }),
        opts
      )
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

function formOpts(page, end, idx, realPage, appId, country, reviews) {
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
              callback_data: JSON.stringify([
                appId,
                'next',
                [realPage, page + 1],
                country,
              ]),
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

module.exports = {
  reviewsByCountryAS,
  reviewsByRatingAS,
  lastReviewsAS,
}
