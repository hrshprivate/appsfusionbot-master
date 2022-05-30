const { UserBot } = require('../models')

async function clearCommand(id){
    try{
        await UserBot.updateOne({chatId: id}, {$set:{"settings.command": null}})
    }catch(err){
        throw err
    }
}

module.exports = clearCommand