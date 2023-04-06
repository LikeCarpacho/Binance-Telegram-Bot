const { get_following_list, check_file } = require('../database')
const { addSession, hasActiveSession } = require('../sessions')
const { get_trades } = require('../binance')

module.exports = async ctx => {
  const user_id = ctx.from.id

  if (hasActiveSession(user_id)) {
    ctx.reply("Bot already active")
    return
  }

  const haveFollowingList = await check_file(user_id)

  if (!haveFollowingList) {
    ctx.reply("You aren't following anyone")
    return
  }

  addSession(user_id)
  await ctx.reply('🤖 Trading bot stated')

  let file = get_following_list(user_id)
  let following_list = JSON.parse(file)[user_id]
  let last_trade = {};

  let firstloop = true;

  let bot_interval = setInterval(async () => {

    if (!hasActiveSession(user_id)) {
      await ctx.reply("✅ Bot successfully stoped")
      clearInterval(bot_interval)
    }

    for (let trader of following_list) {

      const encryptedUid = trader['encryptedUid'];
      const nickName = trader['nickName'];
      const trades = await get_trades(encryptedUid);

      let alltradeactive = []

      last_trade[nickName] ? null : last_trade[nickName] = {}

      for (let trade of trades) {
        alltradeactive.push(trade.updateTimeStamp.toString())
        if (!Object.keys(last_trade[nickName]).includes(trade.updateTimeStamp.toString())) {

          if (!firstloop) {
            await ctx.reply(`
🔵 Open - ${trade.symbol} - ${trade.amount > 0 ? "Long" : "Short"}
User: ${nickName} 🤵
Entry ${trade.entryPrice.toFixed(4)}$
Leverage: x${trade.leverage}✖️
Timestamp: ${trade.updateTimeStamp} ⏰`)
          }

          last_trade[nickName][trade.updateTimeStamp.toString()] = trade;
        }
      }

      let listtradetodelete = []

      for (let traded of Object.keys(last_trade[nickName])) {
        if (!alltradeactive.includes(traded)) {

          let trade_data = last_trade[nickName][traded]
          listtradetodelete.push(traded)

          await ctx.reply(`
🟡 Closed - ${trade_data.symbol} - ${trade_data.amount > 0 ? "Long" : "Short"}
User: ${nickName} 🤵
Entry Price: ${trade_data.entryPrice.toFixed(4)}$
Leverage: x${trade_data.leverage}✖️ 
Timestamp: ${trade_data.updateTimeStamp} ⏰`)
        }
      }

      for (i of listtradetodelete) {
        delete last_trade[nickName][i]
      }

    }
    console.log(`Loop: ${user_id}}`)
    firstloop = false;

  }, 40000) // 10sec


}