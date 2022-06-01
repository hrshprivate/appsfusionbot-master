var gplay = require('google-play-scraper')
const store = require('app-store-scraper')
const { Application } = require('../models')
const { COUNTRIES } = require('../constants/index')
const { checkTermLength, checkAppIdLength } = require('./checkTermLength')

async function searchInsideBothApps(term, page, id) {
  const savedApps = await Application.ApplicationSchema.findOne({
    where: { chatId: id },
  })
  const savedAppsNames = savedApps.applications.map((savedApp) => {
    return {
      appId: savedApp.appId,
      store: savedApp.store,
    }
  })

  const appStoreApps = []
  for (let pageAs = 1; pageAs <= 3; pageAs++) {
    const resp = await store.search({
      term: term,
      num: 50,
      page: pageAs,
    })
    appStoreApps.push(...resp)
    console.log(appStoreApps)
  }

  const googlePlayApps = await gplay.search({
    term: term,
    num: 250,
  })

  let key = await checkTermLength(term)

  const c = []
  let start = page * 3 - 3
  let end = page * 3 - 1
  for (let idx = start; idx <= end; idx++) {
    let description
    if (idx % 2 == 0 && appStoreApps[idx]) {
      const appIdVerified = await checkAppIdLength(appStoreApps[idx].appId)
      description = `App: ${appStoreApps[idx].title}\nSeller: ${appStoreApps[idx].developer}\nStore: appstore`
      const opts = formOptsDoubleSearch(
        appIdVerified,
        'AS',
        key,
        page,
        idx,
        end,
        description,
        savedAppsNames
      )
      c.push({
        icon: appStoreApps[idx].icon,
        opts: opts,
      })
    } else if (idx % 2 != 0 && appStoreApps[idx] && !googlePlayApps[idx]) {
      console.log('APP STORE')
      const appIdVerified = await checkAppIdLength(appStoreApps[idx].appId)
      description = `App: ${appStoreApps[idx].title}\nSeller: ${appStoreApps[idx].developer}\nStore: appstore`
      const opts = formOptsDoubleSearch(
        appIdVerified,
        'AS',
        key,
        page,
        idx,
        end,
        description,
        savedAppsNames
      )
      c.push({
        icon: appStoreApps[idx].icon,
        opts: opts,
      })
    } else {
      const appIdVerified = await checkAppIdLength(googlePlayApps[idx].appId)
      description = `App: ${googlePlayApps[idx].title}\nSeller: ${googlePlayApps[idx].developerId}\nStore: googlestore`
      const opts = formOptsDoubleSearch(
        appIdVerified,
        'GS',
        key,
        page,
        idx,
        end,
        description,
        savedAppsNames
      )
      c.push({
        icon: googlePlayApps[idx].icon,
        opts: opts,
      })
    }
  }

  return c
}

async function sendAppStoreApps(response, term, page, id, ctx) {
  const savedApps = await Application.ApplicationSchema.findOne({
    where: { chatId: id },
  })
  const savedAppsNames = savedApps.applications.map((savedApp) => {
    return {
      appId: savedApp.appId,
      store: savedApp.store,
    }
  })
  const result = []
  // console.log("All apps app store ", response.length)
  const apps = response.map((elem) => {
    return {
      appId: elem.appId,
      title: elem.title,
      icon: elem.icon,
      developer: elem.developer,
      store: 'AS',
    }
  })
  let counter = 0
  for (let app of apps) {
    counter++
    const description = `App: ${app.title}\nSeller: ${app.developer}\nStore: appstore`
    const opts = {
      caption: description,
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Add app',
              callback_data: JSON.stringify([app.appId, 'add', app.store]),
            },
          ],
        ],
      },
    }
    const optsLastElem = {
      caption: description,
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Next',
              callback_data: JSON.stringify({
                command: 'next',
                term: term,
                page: page + 1,
              }),
            },
          ],
        ],
      },
    }

    if (counter === 3) {
      formOptsLastElem(optsLastElem, savedAppsNames, app.appId, 'AS')
      result.push({
        icon: app.icon,
        opts: optsLastElem,
      })
    } else {
      formOpts(opts, savedAppsNames, app.appId, 'AS')
      result.push({
        icon: app.icon,
        opts: opts,
      })
    }
  }
  return result
}

function sendGooglePlayApps(response) {
  // console.log("All apps google store ", response.length)
  const apps = response.map((elem) => {
    return {
      appId: elem.appId,
      title: elem.title,
      icon: elem.icon,
      developer: elem.developerId,
      store: 'GS',
    }
  })
  return apps
}

async function printGoogleApps(
  apps,
  term,
  page,
  ctx,
  counterStart,
  counterEnd,
  id
) {
  const savedApps = await Application.ApplicationSchema.findOne({
    where: { chatId: id },
  })
  const savedAppsNames = savedApps.applications.map((savedApp) => {
    return {
      appId: savedApp.appId,
      store: savedApp.store,
    }
  })
  let counter = 0
  for (let app = counterStart; app < counterEnd; app++) {
    if (!apps[app]) return
    const appIdAS = await checkAppIdLength(apps[app].appId)
    counter++
    const description = `App: ${apps[app].title}\nSeller: ${apps[app].developer}\nStore: googlestore`
    const opts = {
      caption: description,
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Add app',
              callback_data: JSON.stringify([appIdAS, 'add', apps[app].store]),
            },
          ],
        ],
      },
    }
    const optsLastElem = {
      caption: description,
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Next',
              callback_data: JSON.stringify({
                command: 'next',
                term: term,
                page: page + 1,
              }),
            },
          ],
        ],
      },
    }

    if (counter === 3) {
      formOptsLastElem(optsLastElem, savedAppsNames, appIdAS, 'GS')
      await ctx.bot.telegram.sendPhoto(
        ctx.chat.id,
        apps[app].icon,
        optsLastElem
      )
    } else {
      formOpts(opts, savedAppsNames, appIdAS, 'GS')
      await ctx.bot.telegram.sendPhoto(ctx.chat.id, apps[app].icon, opts)
    }
  }
}

async function formOptsLastElem(optsLastElem, savedApps, id, store) {
  let isSavedApp = false
  savedApps.forEach((app) => {
    if (app.appId === id && app.store === store) isSavedApp = true
  })
  if (isSavedApp) {
    optsLastElem['reply_markup']['inline_keyboard'].unshift(
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
      ]
    )
  } else {
    optsLastElem['reply_markup']['inline_keyboard'].unshift([
      {
        text: 'Add app',
        callback_data: JSON.stringify([
          id,
          'add',
          store, //tut
        ]),
      },
    ])
  }
}

async function formOpts(opts, savedApps, id, store) {
  let isSavedApp = false
  savedApps.forEach((app) => {
    if (app.appId === id && app.store === store) isSavedApp = true
  })
  if (isSavedApp) {
    opts['reply_markup']['inline_keyboard'][0] = [
      {
        text: 'Remove app',
        callback_data: JSON.stringify([id, 'remove', store]),
      },
    ]
    opts['reply_markup']['inline_keyboard'][1] = [
      {
        text: 'Show more info and actions',
        callback_data: JSON.stringify([id, 'info', store]),
      },
    ]
  }
}

async function nextListOfGoogleApps(ctx, data, user, key) {
  try {
    //  console.log("GOOGLE_PLAY")
    const response = await gplay.search({
      term: data.term,
      num: 250,
      country: COUNTRIES[user.settings.country][1],
    })
    //  console.log("All apps google ", response.length)
    const apps = sendGooglePlayApps(response)
    const counterStart = data.page * 3 - 3
    const counterEnd = data.page * 3
    await printGoogleApps(
      apps,
      key,
      data.page,
      ctx,
      counterStart,
      counterEnd,
      ctx.chat.id
    )
  } catch (err) {
    console.log('ERROR CALLBACK_QUERY - ', err)
    await ctx.bot.telegram.sendMessage(ctx.chat.id, 'App not found')
  }
}

async function nextListOfAppStoreApps(ctx, data, id, user, key) {
  const response = await store.search({
    term: data.term,
    num: 3,
    page: data.page,
    country: COUNTRIES[user.settings[0].country][0],
  })
  //console.log("All apps app store ", response.length)
  const apps = await sendAppStoreApps(response, key, data.page, id)
  for (let app of apps) {
    //  console.log(app.opts.reply_markup.inline_keyboard)
    await ctx.bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
  }
}

function formOptsDoubleSearch(
  appId,
  store,
  key,
  page,
  currIdx,
  lastIndex,
  description,
  savedApps
) {
  let isSavedApp = false
  savedApps.forEach((app) => {
    if (app.appId === appId && app.store === store) isSavedApp = true
  })
  if (currIdx !== lastIndex) {
    if (isSavedApp) {
      return {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Remove app',
                callback_data: JSON.stringify([appId, 'remove', store]),
              },
            ],
            [
              {
                text: 'Show more info and actions',
                callback_data: JSON.stringify([appId, 'info', store]),
              },
            ],
          ],
        },
      }
    } else {
      return {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Add app',
                callback_data: JSON.stringify([appId, 'add', store]),
              },
            ],
          ],
        },
      }
    }
  } else {
    if (savedApps.includes(appId)) {
      return {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Remove app',
                callback_data: JSON.stringify([appId, 'remove', store]),
              },
            ],
            [
              {
                text: 'Show more info and actions',
                callback_data: JSON.stringify([appId, 'info', store]),
              },
            ],
            [
              {
                text: 'Next',
                callback_data: JSON.stringify([
                  'next',
                  key,
                  page + 1,
                  lastIndex,
                ]),
              },
            ],
          ],
        },
      }
    } else {
      return {
        caption: description,
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Add app',
                callback_data: JSON.stringify([appId, 'add', store]),
              },
            ],
            [
              {
                text: 'Next',
                callback_data: JSON.stringify([
                  'next',
                  key,
                  page + 1,
                  lastIndex,
                ]),
              },
            ],
          ],
        },
      }
    }
  }
}

module.exports = {
  sendAppStoreApps,
  sendGooglePlayApps,
  printGoogleApps,
  searchInsideBothApps,
  nextListOfGoogleApps,
  nextListOfAppStoreApps,
}
