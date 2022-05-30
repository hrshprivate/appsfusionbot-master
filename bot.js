const { Telegraf } = require('telegraf')
const session = require('telegraf/session')
const translate = require('translate-google')
const Agent = require('socks5-https-client/lib/Agent')
const TelegrafI18n = require('telegraf-i18n')
const gplay = require('google-play-scraper')
const store = require('app-store-scraper')
const {
  sendAppStoreApps,
  sendGooglePlayApps,
  printGoogleApps,
  searchInsideBothApps,
  nextListOfGoogleApps,
  nextListOfAppStoreApps,
} = require('./utils/search')
const { setFeedback, setStore, preSearch } = require('./utils/commands')
const path = require('path')
const mongoose = require('mongoose')
const {
  MAIN_MENU,
  SEARCH_MENU,
  RAITING_MENU,
  COUNTRIES,
} = require('./constants')
const {
  myAppInfo,
  removeApp,
  nextListOfMyApps,
  addApp,
} = require('./utils/app')
const {
  reviewsByRatingAS,
  reviewsByCountryAS,
  lastReviewsAS,
} = require('./utils/reviewsAppStore')
const {
  reviewsByRatingGS,
  reviewsByCountryGS,
  lastReviewsGS,
} = require('./utils/reviewsGoogle')
const formCountriesMenu = require('./utils/formCountriesMenu')
const { UserBot, AppReviews } = require('./models')
const {
  addNewSubscribtion,
  reviewsLoadMore,
  markAllReviewsRead,
} = require('./utils/mailingList')
const agenda = require('./services/agenda/index')
const { unSubscribe, subscribe } = require('./utils/subscription')
const {
  keyboardAfterAddApp,
  keyboardAfterRemove,
  changeKeyboard,
  keyboardAfterUnsubscribe,
  keyboardAfterSubscribe,
  keyboardAfterLoadMore,
  keyboardAfterSelect,
  keyboardAfterNext,
  keyboardAfterNextReviews,
} = require('./utils/keyboardForm')
const { formMessageForSearch } = require('./utils/formMessage')
const { getInvoice } = require('./utils/payment')
const { checkTermLength, getTerm } = require('./utils/checkTermLength')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN, {
  polling: true,
  telegram: {
    agentClass: Agent,
    agentOptions: {
      socksHost: '0.0.0.0',
      socksPort: 5000,
    },
  },
})

// const bot = new Telegraf(process.env.BOT_TOKEN, {
//      telegram: { agent: socksAgent }
// })

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false,
  directory: path.resolve(__dirname, 'locales'),
})

bot.use(session())
bot.context.bot = bot
bot.context.mainMenu = MAIN_MENU
bot.context.searchMenu = SEARCH_MENU
bot.context.ratingMenu = RAITING_MENU
bot.use(i18n.middleware())
bot.use(require('./composers/payment.composer'))
bot.use(require('./composers/subscription.composer'))
bot.use(require('./composers/apps.composer'))
bot.use(require('./composers/start.composer'))
bot.use(require('./composers/mainMenu.composer'))
bot.use(require('./composers/search.composer'))
bot.use(require('./composers/review.composer'))

mongoose.connect(
  'mongodb+srv://user123:user123@cluster0.nivix.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  async function (err) {
    if (err) return console.log('ERROR MONGO', err)
    await agenda.start()

    bot.on('message', async (ctx) => {
      const id = ctx.from.id
      const user = await UserBot.findOne({ chatId: id })
      const term = ctx.message.text
      try {
        if (user.settings.command === 'feedback') {
          await setFeedback(ctx, id)
          await bot.telegram.sendMessage(
            ctx.chat.id,
            `Thank you! We read all the applications`
          )
        } else if (user.settings.command === 'search') {
          ctx.session.term = term
          if (user.settings.store === 'APP_STORE') {
            const response = await store.search({
              term: term,
              num: 3,
              page: 1,
              country: COUNTRIES[user.settings.country][0],
            })
            ctx.session.search = response
            const page = 1
            let key = await checkTermLength(term)
            const apps = await sendAppStoreApps(response, key, page, id, ctx)
            //if(!apps.length) return bot.telegram.sendMessage(ctx.chat.id, "There are no app")
            for (let app of apps) {
              await bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
            }
          }
          if (user.settings.store === 'GOOGLE_PLAY') {
            const response = await gplay.search({
              term: term,
              num: 250,
              country: COUNTRIES[user.settings.country][1],
            })
            let key = await checkTermLength(term)
            const page = 1
            const apps = sendGooglePlayApps(response)
            await printGoogleApps(apps, key, page, ctx, 0, 3, id)
          }
          if (user.settings.store === 'BOTH') {
            const page = 1
            const apps = await searchInsideBothApps(term, page, id)
            for (let app of apps) {
              await bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
            }
          }
        } else if (user.settings.command === 'setstore') {
          const updatedUser = await setStore(ctx, id)
          const message = formMessageForSearch(updatedUser, ctx)
          await UserBot.updateOne(
            { chatId: id },
            {
              $set: {
                'settings.command': 'search',
              },
            }
          )
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            message,
            ctx.searchMenu
          )
        } else if (
          user.settings.command !== 'feedback' &&
          user.settings.command !== 'search'
        ) {
          const message = formMessageForSearch(user, ctx)
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            message,
            ctx.searchMenu
          )
          await preSearch(id)
        }
      } catch (err) {
        if (err.response && err.response.error_code == 429) {
          console.log('ERROR MESSAGE ')
        } else
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Something went wrong...'
          )
      }
    })

    bot.on('callback_query', async (ctx) => {
      try {
        const id = ctx.from.id
        const user = await UserBot.findOne({ chatId: id })
        let data = ctx.update.callback_query.data
        data = JSON.parse(data)
        //console.log(data)

        /* SUBSCRIPTION LOAD MORE */
        if (user.settings.command === 'subscription') {
          if (data[1] === 'loadMore') {
            await reviewsLoadMore(ctx.chat.id, {
              appId: data[0],
              storeName: data[2],
            })
            bot.telegram.deleteMessage(
              ctx.chat.id,
              ctx.update.callback_query.message.message_id
            )
          }
          if (data[1] === 'read') {
            await markAllReviewsRead(ctx.chat.id, {
              appId: data[0],
              storeName: data[2],
            })
            bot.telegram.deleteMessage(
              ctx.chat.id,
              ctx.update.callback_query.message.message_id
            )
          }
        }

        if (data.state === 'select') {
          const keyboard = keyboardAfterSelect(data.plan)
          switch (data.plan) {
            case 'BASIC':
              if (user.subscription.apps > 2)
                return ctx.reply(
                  ctx.i18n.t('checkPlan', {
                    requiredNum: 2,
                    extraNum: user.subscription.apps - 2,
                  })
                )
              break
            case 'MINI':
              if (user.subscription.apps > 6)
                return ctx.reply(
                  ctx.i18n.t('checkPlan', {
                    requiredNum: 6,
                    extraNum: user.subscription.apps - 6,
                  })
                )
              break
            default:
              break
          }
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Press the button for pay selected plan',
            keyboard
          )
        }

        if (data.state === 'pay') {
          let invoiceTitle, InvoiceDescription, amount
          switch (data.plan) {
            case 'BASIC':
              invoiceTitle = 'Basic'
              InvoiceDescription =
                'Stores: AppStore & Google Play  Apps count: 2'
              amount = 4
              break
            case 'MINI':
              invoiceTitle = 'Mini-Studio'
              InvoiceDescription =
                'Stores: AppStore & Google Play  Apps count: 6'
              amount = 7
              break
            default:
              invoiceTitle = 'Crew'
              InvoiceDescription =
                'Stores: AppStore & Google Play  Apps count: unlimited'
              amount = 9
              break
          }
          return ctx.replyWithInvoice(
            getInvoice(ctx.from.id, invoiceTitle, InvoiceDescription, amount)
          )
        }

        /* TRANSLATE */
        if (data.state === 'tr') {
          const messageStrings =
            ctx.update.callback_query.message.text.split('\n')
          const translatedText = await translate(messageStrings[2], {
            to: 'en',
          })
          const editedMessage =
            ctx.update.callback_query.message.text +
            `\n\n_Translated_: ${translatedText}`
          ctx.telegram.editMessageText(
            ctx.chat.id,
            ctx.update.callback_query.message.message_id,
            null,
            editedMessage,
            {
              parse_mode: 'markdown',
              reply_markup: ctx.update.callback_query.message.reply_markup,
            }
          )
        }

        /* REVIEWS (NEXT) */
        if (user.settings.command === 'lastReview') {
          const appId = data[0]
          const page = data[2]

          if (data[1] === 'next') {
            if (user.currentApp.store === 'AS')
              await lastReviewsAS(ctx, page, appId)
            else await lastReviewsGS(ctx, page, appId)
          }
        }

        if (user.settings.command === 'reviewCountry') {
          if (data[1] === 'next') {
            const appId = data[0]
            if (user.currentApp.store === 'AS') {
              const realPage = data[2][0]
              const currPage = data[2][1]
              const country = data[3]
              await reviewsByCountryAS(
                ctx,
                realPage,
                currPage,
                appId,
                user,
                country
              )
            } else
              await reviewsByCountryGS(
                ctx,
                appId,
                user.currentApp.nextPaginationToken,
                user.currentApp.country
              )
          }
        }
        if (user.settings.command === 'reviewRating') {
          //  console.log("REVIEWS BY RATING NEXT", data)
          const appId = data[0]
          const page = data[2]
          const score = data[3]

          if (data[1] === 'next') {
            if (user.currentApp.store === 'AS')
              await reviewsByRatingAS(ctx, page, appId, score)
            else await reviewsByRatingGS(ctx, page, appId, score)
          }
        }

        /*COMMAND APP INFO */
        if (data[1] === 'last') {
          //  console.log("LAST REVIEWS", data)
          await UserBot.updateOne(
            { chatId: id },
            {
              $set: {
                'currentApp.appId': data[0],
                'currentApp.store': data[2],
                'settings.command': 'lastReview',
              },
            }
          )
          if (data[2] === 'AS') {
            await lastReviewsAS(ctx, 1, data[0])
          } else {
            await lastReviewsGS(ctx, 1, data[0])
          }
        }

        if (data[1] === 'country') {
          // console.log("REVIEWS BY COUNTRY", data)
          await UserBot.updateOne(
            { chatId: id },
            {
              $set: {
                'currentApp.appId': data[0],
                'currentApp.store': data[2],
                'settings.command': 'reviewCountry',
              },
            }
          )
          const countries = formCountriesMenu()
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Choose country',
            countries
          )
        }

        if (data[1] === 'rating') {
          // console.log("REVIEWS BY RATING", data)
          await UserBot.updateOne(
            { chatId: id },
            {
              $set: {
                'currentApp.appId': data[0],
                'currentApp.store': data[2],
                'settings.command': 'reviewRating',
              },
            }
          )
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Choose rating',
            ctx.ratingMenu
          )
        }

        if (data[1] === 'unsub') {
          await unSubscribe(ctx.chat.id, data[0], data[2])
          changeKeyboard(ctx, data, keyboardAfterUnsubscribe)
        }
        if (data[1] === 'sub') {
          const dayReport = agenda.create('app-subscription', {
            chatId: ctx.chat.id,
            appId: data[0],
            store: data[2],
            user: user,
          })
          //await agenda.start();
          await dayReport.repeatEvery('80 minutes').save()
          await subscribe(ctx.chat.id, data[0], data[2], user)
          changeKeyboard(ctx, data, keyboardAfterSubscribe)
        }

        /* COMMAND MY APP */
        if (data[1] === 'info') {
          //   console.log("INFO")
          await UserBot.updateOne(
            { chatId: id },
            { $set: { 'settings.command': 'appInfo' } }
          )
          const app = await myAppInfo(
            { appId: data[0], store: data[2] },
            ctx.chat.id
          )
          await ctx.bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
        }
        if (user.settings.command === 'myapp') {
          if (data.state === 'next') {
            await nextListOfMyApps(ctx, data, id)
          }
        }

        /* COMMAND SEARCH */
        if (data[1] === 'add') {
          const reviews = await AppReviews.findOne({
            appId: data[0],
            store: data[2],
          })
          if (!reviews) {
            let reviews = await AppReviews.create({
              appId: data[0],
              store: data[2],
            })
            const app = await agenda.create('app-reviews', {
              appId: data[0],
              reviewsId: reviews.id,
              store: data[2],
            })
            await app.repeatEvery('60 minutes').save()
          }
          await addApp(ctx, { id: data[0], store: data[2] }, user)
          await addNewSubscribtion(ctx.chat.id, data[0], data[2], user)
          const dayReport = agenda.create('app-subscription', {
            chatId: ctx.chat.id,
            appId: data[0],
            store: data[2],
            user: user,
          })
          // await agenda.start();
          await dayReport.repeatEvery('80 minutes').save()
          changeKeyboard(ctx, data, keyboardAfterAddApp)
          let storeName
          if (data[2] === 'AS') storeName = 'App Store'
          else storeName = 'Google Play Store'
          await bot.telegram.sendMessage(
            ctx.chat.id,
            ctx.i18n.t('addApp', { id: data[0], store: storeName })
          )
        }

        if (data[1] === 'remove') {
          await removeApp(ctx, { id: data[0], store: data[2] })
          changeKeyboard(ctx, data, keyboardAfterRemove)
        }

        if (data[0] === 'next' || data.command === 'next') {
          const newData = {
            term: data[1] || data.term,
            page: data[2] || data.page,
          }
          if (user.settings.store === 'APP_STORE') {
            const key = newData.term
            let term = await getTerm(key)
            newData.term = term
            await nextListOfAppStoreApps(ctx, newData, id, user, key)
          }
          if (user.settings.store === 'GOOGLE_PLAY') {
            const key = newData.term
            let term = await getTerm(key)
            newData.term = term
            await nextListOfGoogleApps(ctx, newData, user, key)
          }
          if (user.settings.store === 'BOTH') {
            const key = newData.term
            let term = await getTerm(key)
            newData.term = term
            const apps = await searchInsideBothApps(
              newData.term,
              newData.page,
              id
            )
            for (let app of apps) {
              await bot.telegram.sendPhoto(ctx.chat.id, app.icon, app.opts)
            }
          }
        }

        if (
          data[0] === 'next' ||
          data.command === 'next' ||
          data.state === 'next'
        ) {
          await keyboardAfterNext(ctx)
        }
        if (data[1] === 'next') {
          await keyboardAfterNextReviews(ctx)
        }
      } catch (err) {
        console.log('MESSAGE - ', err)
        if (err.message === 'no subscription')
          await ctx.bot.telegram.sendMessage(ctx.chat.id, 'No subscription...')
        else if (err.message === 'limit is exceeded')
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Limit is exceeded...'
          )
        else if (err.response && err.response.error_code == 429) {
          console.log('ERROR CALLBACK_QUERY')
        } else
          await ctx.bot.telegram.sendMessage(
            ctx.chat.id,
            'Something went wrong...'
          )
      }
    })

    bot.launch()
  }
)
