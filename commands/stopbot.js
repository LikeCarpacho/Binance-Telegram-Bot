const { hasActiveSession, stopSession } = require('../sessions')

module.exports = async ctx => {
  const user_id = ctx.from.id
  if (hasActiveSession(user_id)) {
    stopSession(user_id)
    await ctx.reply("Disconnecting ..")
  } else {
    await ctx.reply("No session running.")
  }
}