const mongoose = require('mongoose')
const { UserBot, Application } = require('../../models')
const sequelize = require('../../config/db')
const { Op } = require('sequelize')

// mongoose.connect("mongodb://localhost:27017/apps-fusion-bot-dev-db", { useUnifiedTopology: true, useNewUrlParser: true });

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (e) {
    console.log(e)
  }
}

async function run() {
  const users = await UserBot.findAll()
  await UserBot.UserBotSchema.destroy({ force: true })
  for (let user of users) {
    console.log(user)
    const application = await Application.findOne({
      where: { chatId: user.chatId },
    })
    await UserBot.UserBotSchema.create({
      chatId: user.chatId,
      firstName: user?.first_name,
      lastName: user?.last_name,
      username: user?.username,
    })
    if (!application) {
      await Application.create({
        chatId: user.chatId,
        applications: [],
      })
    } else {
      console.log(user.chatId)
    }
  }
  sequelize.close()
}
start()
run()
