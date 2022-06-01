const { UserBot } = require('../models')

async function clearCommand(id) {
  try {
    const user = UserBot.UserBotSchema.findOne({ where: { chatId: id } })
    await UserBot.Settings.update(
      { command: null },
      {
        where: {
          BotUserId: user.id,
        },
      }
    )
  } catch (err) {
    throw err
  }
}

module.exports = clearCommand
