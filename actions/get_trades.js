const { get_trades, get_user_info } = require('../binance')

module.exports = async ctx => {
  const arg1 = ctx.match[1].split("#")[1]
  const positions = await get_trades(arg1)
  const sorted_positions = positions.sort((a, b) => {
    const date1 = new Date(a.updateTimeStamp);
    const date2 = new Date(b.updateTimeStamp);
    return date1 - date2;
  });
  const user_info = await get_user_info(arg1)

  if (Array.isArray(positions) && positions.length === 0) {
    await ctx.reply('🚫 No trades')
    return
  }

  let separation = '='.repeat(user_info.nickName.length) + "===="
  await ctx.reply(`
${separation}
🤵 ${user_info.nickName} - ${user_info.followerCount} followers
${separation}
`)

  await ctx.reply(`💻 ${positions.length} positions open`)
  let all_roe = []

  for (const trade of sorted_positions) {
    all_roe.push(trade.roe*100)
    const diff = new Date() - new Date(trade.updateTimeStamp)
    const elapsed = {
      day: Math.floor(diff / (24 * 60 * 60 * 1000)),
      hour: Math.floor((diff / (60 * 60 * 1000)) % 24),
      minute: Math.floor((diff / (60 * 1000)) % 60)
    }
    const time_message = `Period: ${elapsed.day} Day${elapsed.day > 1 ? 's' : ''}, ${elapsed.hour} Hour${elapsed.hour > 1 ? 's' : ''}, ${elapsed.minute} Minute${elapsed.minute > 1 ? 's' : ''} ⏰`
    const isPositive = parseFloat(trade['pnl']) >= 0 ? '🟢' : '🔴';
    const tradeType = trade.amount > 0 ? "Long" : "Short"
    await ctx.reply(`
${isPositive} ${trade.symbol} - ${tradeType}
Price: ${trade.entryPrice.toFixed(4)}$ => ${trade.markPrice.toFixed(4)}$
Profit: ${(trade.roe * 100).toFixed(4)}% 📈
Leverage: x${trade.leverage}✖️
${time_message}
`)
  }
  const total_profit = (all_roe.reduce((acc, val) => acc + val, 0)).toFixed(2)
  await ctx.reply(`💸 Total Profit ${total_profit >= 0 ? '+' : ''}${total_profit}%`)
}