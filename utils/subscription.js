const { Subscription, AgendaJobs } = require('../models')

require('dotenv').config()

async function unSubscribe(chatId, appId, store) {
  try {
    // await AgendaJobs.findOneAndDelete({
    //     name: "app-subscription",
    //     "data.chatId":chatId,
    //     "data.appId": appId,
    //     "data.store": store})

    await Subscription.SubscriptionSchema.update(
      { isSubscribe: false },
      {
        where: {
          chatId: chatId,
          appId: appId,
          store: store,
        },
      }
    )
  } catch (err) {
    console.log(err)
  }
}

async function subscribe(chatId, appId, store, user) {
  try {
    await Subscription.SubscriptionSchema.update(
      { isSubscribe: true },
      {
        where: {
          chatId: chatId,
          appId: appId,
          store: store,
        },
      }
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  unSubscribe,
  subscribe,
}
