const mongoose = require('mongoose')
const {
  UserBot,
  Application,
  AgendaJobs,
  Subscription,
} = require('../../models')
const fs = require('fs')
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
  const users = await UserBot.UserBotSchema.findAll()
  const applications = await Application.ApplicationSchema.findAll()
  // const jobs = await AgendaJobs.find()
  const subscriptions = await Subscription.SubscriptionSchema.findAll()

  fs.writeFileSync('dataDB/user.json', JSON.stringify(users))
  fs.writeFileSync('dataDB/applications.json', JSON.stringify(applications))
  // fs.writeFileSync('dataDB/jobs.json', JSON.stringify(jobs))
  fs.writeFileSync('dataDB/subscriptions.json', JSON.stringify(subscriptions))
  console.log('FINISHED')
  sequelize.close()
}
start()
run()
