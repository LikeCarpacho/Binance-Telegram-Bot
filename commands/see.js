const { get_leaderboard } = require('../binance')
const { Leaderboard_Lenght } = require('../config')

module.exports = async ctx => {
  const leaderboard = await get_leaderboard()
  leaderboard.sort((a, b) => b.followerCount - a.followerCount)
  let traders_buttons = []
  for (let i = 0; i < Leaderboard_Lenght; i++) {
    let user = leaderboard[i]
    traders_buttons.push([{ text: `${user['nickName']} - ${user.followerCount} followers`, callback_data: `get_trades#${user['encryptedUid']}` }])
  }
  await ctx.reply('> Binance Leaderboard <', {
    reply_markup: {
      inline_keyboard: traders_buttons
    }
  });
}