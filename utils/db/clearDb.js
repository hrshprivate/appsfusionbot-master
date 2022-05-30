const mongoose = require("mongoose");
const { UserBot, Application } = require('../../models')



mongoose.connect("mongodb://localhost:27017/apps-fusion-bot-dev-db", { useUnifiedTopology: true, useNewUrlParser: true });
 
async function run(){
const users = await UserBot.find()
await UserBot.deleteMany()
for(let user of users){
    console.log(user)
    const application = await Application.findOne({chatId: user.chatId})
    await UserBot.create({
        chatId: user.chatId,
        firstName: user?.first_name,
        lastName: user?.last_name,
        username: user?.username,
        settings: {
          command: null,
          store: 'APP_STORE',
          country: "United States of America"
        },
        currentApp:{
          appId: null,
          country: null,
          store: null,
          nextPaginationToken: null
        }
    })
    if(!application){
        await  Application.create({
            chatId: user.chatId,
            applications: []
           })
    }else{
       console.log(user.chatId)
    }
}
mongoose.disconnect();

}
run()
