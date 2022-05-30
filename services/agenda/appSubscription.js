const { Subscription } = require("../../models");
const { reviewsTimeTable } = require("../../utils/mailingList");


module.exports = function (agenda) {
  agenda.define('app-subscription', async (job) => {
    try{
      //  console.log("AGENDA APP-SUBSCRIPTION")
        const { chatId, appId, store , user} = job.attrs.data;
        const subscription = await Subscription.findOne({chatId, appId, store})
        if(subscription && subscription.isSubscribe === true) await reviewsTimeTable(chatId, appId, store, user)
    }catch(err){
        console.log(err)
    }
  });
};