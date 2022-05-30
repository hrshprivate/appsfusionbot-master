const mongoose = require("mongoose");
const { UserBot, Application, AgendaJobs, Subscription,  } = require('../../models')
const fs = require('fs')


mongoose.connect("mongodb://localhost:27017/apps-fusion-bot-dev-db", { useUnifiedTopology: true, useNewUrlParser: true });
 
async function run(){
   const users = await UserBot.find()
   const applications = await Application.find()
   const jobs = await AgendaJobs.find()
   const subscriptions = await Subscription.find()

   fs.writeFileSync("dataDB/user.json", JSON.stringify(users));
   fs.writeFileSync("dataDB/applications.json", JSON.stringify(applications));
   fs.writeFileSync("dataDB/jobs.json", JSON.stringify(jobs));
   fs.writeFileSync("dataDB/subscriptions.json", JSON.stringify(subscriptions));
   console.log("FINISHED")
mongoose.disconnect();

}
run()
