// const { Subscription, UserBot, AgendaJobs } = require("../../models");

// module.exports = function (agenda) {
//   agenda.define('bot-subscription', async (job) => {
//     try{
//       //  console.log("AGENDA BOT-SUBSCRIPTION")
//         const { id } = job.attrs.data;
//         const user = await UserBot.findOne({chatId: id})
//         if(user.subscription.days === 1){
//             await UserBot.findOneAndUpdate(
//                 {chatId: user.chatId},
//                 {
//                     "subscription.days": 0,
//                     "subscription.isSubscribe":  false,
//                     "subscription.isTrial": false
//                 })

//             await Subscription.updateMany(
//                 {chatId: id},
//                 {isSubscribe: false})

//             await AgendaJobs.deleteMany({
//                 name: 'bot-subscription',
//                 "data.id": id
//             })

//         }else{
//             await UserBot.findOneAndUpdate(
//                 {chatId: user.chatId},
//                 { $inc : { "subscription.days" : -1 }})
//         }
//     }catch(err){
//         console.log(err)
//     }
//   });
// };
