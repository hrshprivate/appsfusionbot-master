const mongoose = require('mongoose')
const { Op } = require('sequelize')
const {
  UserBot,
  Application,
  AgendaJobs,
  Subscription,
} = require('../../models')
const sequelize = require('../../config/db')

// mongoose.connect('mongodb://localhost:27017/apps-fusion-bot-dev-db', {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// })

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
  } catch (e) {
    console.log(e)
  }
}

async function run() {
  const all = await UserBot.UserBotSchema.findAll({
    include: [UserBot.Subscription],
  })
  const users = await UserBot.Subscription.findAll({
    where: {
      days: {
        [Op.lte]: -1,
      },
      BotUserId: {
        [Op.between]: [all[0].id, all[-1].id],
      },
    },
  })
  const chatIds = users.map((user) => {
    return user.chatId
  })

  // await AgendaJobs.deleteMany({
  //   name: 'bot-subscription',
  //   'data.id': { $in: chatIds },
  // })

  for (let chatId of chatIds) {
    const subscriptions = await Subscription.findAll({
      where: { chatId: chatId },
    })
    console.log('Subscriptions - ', subscriptions?.length)
    await Subscription.update(
      { isSubscribe: false },
      {
        where: {
          chatId: chatId,
        },
      }
    )
    await UserBot.UserBotSchema.findOneAndUpdate(
      { chatId },
      {
        'subscription.apps': subscriptions?.length,
        'subscription.days': 0,
        'subscription.isSubscribe': false,
        'subscription.isTrial': false,
      }
    )
  }

  const users2Step = await UserBot.findAll()
  const chatIds2Step = users2Step.map((user) => {
    return user.chatId
  })
  for (let chatId of chatIds2Step) {
    const subscriptions = await Subscription.SubscriptionSchema.findAll({
      where: { chatId: chatId },
    })
    const userFind = await UserBot.UserBotSchema.findOne({
      where: { chatId: chatId },
    })
    console.log(
      chatId,
      userFind.subscriptions[0].isTrial,
      userFind.subscriptions[0].isSubscribe,
      subscriptions?.length
    )
    if (
      userFind.subscription.isTrial === true &&
      userFind.subscription.isSubscribe === false &&
      subscriptions?.length >= 1
    ) {
      await UserBot.findOneAndUpdate(
        { chatId },
        {
          'subscription.apps': subscriptions?.length,
          'subscription.isTrial': false,
          'subscription.isSubscribe': true,
        }
      )
    }
    if (
      userFind.subscription.isTrial === true &&
      userFind.subscription.isSubscribe === true
    ) {
      await UserBot.findOneAndUpdate(
        { chatId },
        {
          'subscription.apps': subscriptions?.length,
          'subscription.isTrial': false,
          'subscription.isSubscribe': true,
        }
      )
    }
    await UserBot.findOneAndUpdate(
      { chatId },
      {
        'subscription.apps': subscriptions?.length,
      }
    )
  }

  sequelize.close()
}
start()
run()
