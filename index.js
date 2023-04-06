const { Telegraf } = require('telegraf');
const { Token } = require('./config')
const bot = new Telegraf(Token);

bot.command('start', require(`./commands/start`))
bot.command('see', require(`./commands/see`))
bot.command('follow', require(`./commands/follow`))
bot.command('following', require(`./commands/following`))
bot.command('startbot', require(`./commands/startbot`))
bot.command('stopbot', require(`./commands/stopbot`))

bot.action(/get_trades(.+)/, require('./actions/get_trades'))

bot.launch()
