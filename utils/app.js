const gplay = require('google-play-scraper')
const store = require('app-store-scraper')
const {
  Application,
  Subscription,
  UserBot,
  AgendaJobs,
  AppReviews,
} = require('../models')
const agenda = require('../services/agenda/index')
const { getAppId } = require('./checkTermLength')

async function myApps(id, apps, page, counterStart, counterEnd) {
  try {
    //  console.log("PAGE - ", page,"START - ", counterStart,"END - ",counterEnd )
    const myApps = []
    for (let idx = counterStart; idx <= counterEnd; idx++) {
      let description
      let app
      const appId = await getAppId(apps[idx].appId)
      if (apps[idx].store === 'AS') {
        app = await store.app({ appId })
        description = `App: ${app.title}\nSeller: ${app.developer}\nStore: appstore`
        const opts = formOpts(
          apps[idx].appId,
          'AS',
          description,
          counterStart,
          counterEnd,
          idx,
          page,
          apps.length
        )
        myApps.push({
          icon: app.icon,
          opts,
        })
      } else {
        app = await gplay.app({ appId })
        description = `App: ${app.title}\nSeller: ${app.developer}\nStore: googlestore`
        const opts = formOpts(
          apps[idx].appId,
          'GS',
          description,
          counterStart,
          counterEnd,
          idx,
          page,
          apps.length
        )
        myApps.push({
          icon: app.icon,
          opts,
        })
      }
    }
    return myApps
  } catch (err) {
    console.log(err)
  }
}

function formOpts(
  id,
  store,
  description,
  counterStart,
  counterEnd,
  currIdx,
  page,
  length
) {
  let opts
  if (currIdx !== counterEnd)
    opts = {
      caption: description,
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Remove app',
              callback_data: JSON.stringify([id, 'remove', store]),
            },
          ],
          [
            {
              text: 'Show more info and actions',
              callback_data: JSON.stringify([id, 'info', store]),
            },
          ],
        ],
      },
    }
  else {
    if (counterEnd - counterStart == 2 && currIdx != length - 1) {
      opts = {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Remove app',
                callback_data: JSON.stringify([id, 'remove', store]),
              },
            ],
            [
              {
                text: 'Show more info and actions',
                callback_data: JSON.stringify([id, 'info', store]),
              },
            ],
            [
              {
                text: 'Next',
                callback_data: JSON.stringify({
                  state: 'next',
                  page: page + 1,
                }),
              },
            ],
          ],
        },
      }
    } else {
      opts = {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Remove app',
                callback_data: JSON.stringify([id, 'remove', store]),
              },
            ],
            [
              {
                text: 'Show more info and actions',
                callback_data: JSON.stringify([id, 'info', store]),
              },
            ],
          ],
        },
      }
    }
  }
  return opts
}

async function myAppInfo(data, chatId) {
  const { appId, store: storeName } = data
  const newAppId = await getAppId(appId)
  let appInfo
  const opts = {
    caption: 'description',
    parse_mode: 'markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'App url',
          },
        ],
        [
          {
            text: 'Show last reviews',
            callback_data: JSON.stringify([appId, 'last', storeName]),
          },
        ],
        [
          {
            text: 'Show reviews by rating',
            callback_data: JSON.stringify([appId, 'rating', storeName]),
          },
        ],
        [
          {
            text: 'Show reviews by country',
            callback_data: JSON.stringify([appId, 'country', storeName]),
          },
        ],
      ],
    },
  }
  const subscription = await Subscription.SubscriptionSchema.findOne({
    where: {
      chatId,
      appId,
      store: storeName,
    },
  })
  if (subscription.isSubscribe === false) {
    opts.reply_markup.inline_keyboard.push([
      {
        text: 'Subscribe',
        callback_data: JSON.stringify([appId, 'sub', storeName]),
      },
    ])
  } else {
    opts.reply_markup.inline_keyboard.push([
      {
        text: 'Unsubscribe',
        callback_data: JSON.stringify([appId, 'unsub', storeName]),
      },
    ])
  }
  try {
    const appReviews = await AppReviews.AppReviewsSchema.findOne({
      where: { appId, store: storeName },
    })
    let reviews
    if (appReviews.reviewsCount === null)
      reviews = 'It takes some time to calculate'
    else reviews = appReviews.reviewsCount
    if (storeName === 'AS') {
      app = await store.app({
        appId: newAppId,
      })

      opts.reply_markup.inline_keyboard[0][0].url = app?.url
      const description = `*${app.title}* \n\nSeller name: ${app.developer} \nReviews: *${reviews}*`
      opts.caption = description
      appInfo = {
        icon: app.icon,
        opts: opts,
      }
    } else {
      let app = await gplay.app({
        appId: newAppId,
      })
      opts.reply_markup.inline_keyboard[0][0].url = app?.url
      const description = `*${app.title}* \n\nSeller name: ${app.developerId} \nReviews: *${reviews}*`
      opts.caption = description
      appInfo = {
        icon: app.icon,
        opts: opts,
      }
    }
    return appInfo
  } catch (err) {
    throw err
  }
}

async function addApp(ctx, { id, store }, user) {
  // console.log("ADD APP")
  const up_user = await UserBot.UserBotSchema.findOne({
    where: { chatId: user.chatId },
    include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
  })
  let userUpdated = user
  if (
    user.subscriptions[0].isTrial === true &&
    user.subscriptions[0].isSubscribe === false
  ) {
    await UserBot.Subscription.update(
      { days: 15, apps: 1, isTrial: false, isSubscribe: true },
      {
        where: {
          BotUserId: up_user.id,
        },
      }
    )
    userUpdated = await UserBot.UserBotSchema.findOne({
      where: { chatId: user.chatId },
      include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
    })
    // const dayReport = agenda.create('bot-subscription', { id: ctx.chat.id })
    // await dayReport.repeatEvery('1 day').save()
  } else {
    if (userUpdated.subscriptions[0].isSubscribe === true) {
      if (
        userUpdated.subscriptions[0].plan === 'MINI' &&
        userUpdated.subscriptions[0].apps === 6
      ) {
        throw Error('limit is exceeded')
      }
      if (
        userUpdated.subscriptions[0].plan === 'BASIC' &&
        userUpdated.subscriptions[0].apps === 2
      ) {
        throw Error('limit is exceeded')
      }
    } else {
      throw Error('no subscription')
    }
    await UserBot.Subscription.update(
      { apps: 1 },
      {
        where: {
          BotUserId: userUpdated.id,
        },
      }
    )
  }
  let tasks = await Application.ApplicationSchema.findOne({
    where: { chatId: ctx.from.id },
  })
  tasks.applications.push({ appId: id, store: store })
  console.log(tasks.applications)
}

async function removeApp(ctx, { id, store }) {
  //  console.log("MY APP REMOVE - ", id, store)
  await Application.ApplicationSchema.findOne(
    { chatId: ctx.from.id },
    {
      $pull: {
        applications: { appId: id },
        store: { store },
      },
    },
    { safe: true, multi: false, new: true }
  )
  const ff = await UserBot.UserBotSchema.findOne({
    where: { chatId: ctx.chat.id },
    include: [UserBot.CurrentApp, UserBot.Settings, UserBot.Subscription],
  })
  //   let test = await UserBot.UserBotSchema.findOneAndUpdate(
  //     { chatId: ctx.chat.id },
  //     { $inc: { 'subscription.apps': -1 } }
  //   )
  // console.log(ff.subscriptions[0])
  let test = ff.subscriptions[0].increment('apps', { by: -1 })
  await Subscription.SubscriptionSchema.destroy({
    where: { chatId: ctx.chat.id, store: store, appId: id },
  })
  //   await AgendaJobs.deleteMany({
  //     name: 'app-subscription',
  //     'data.chatId': ctx.chat.id,
  //     'data.appId': id,
  //     'data.store': store,
  //   })
}

async function nextListOfMyApps(ctx, data, id) {
  //  console.log("MY APP NEXT")
  const apps = await Application.findOne({ where: { chatId: id } })
  const counterStart = data.page * 3 - 3
  const counterEnd =
    data.page * 3 > apps.applications.length
      ? apps.applications.length - 1
      : data.page * 3 - 1
  const appObjs = await myApps(
    id,
    apps.applications,
    data.page,
    counterStart,
    counterEnd
  )
  for (let app of appObjs) {
    await ctx.bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
  }
}

module.exports = {
  myApps,
  myAppInfo,
  removeApp,
  nextListOfMyApps,
  addApp,
}
